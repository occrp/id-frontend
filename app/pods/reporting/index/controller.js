import Ember from 'ember';
import { statusList } from 'id-frontend/models/ticket';

const { isPresent, computed, get } = Ember;

// Group items by date and also as a status hash
const groupByDate = (items) => {

  // Need to account for items not being present if the count is 0
  const emptyStats = {
    count: 0,
    pastDeadlineCount: 0,
    avgTime: 0
  };

  let emptyDataset = {};
  statusList.forEach((status) => {
    emptyDataset[status] = Object.assign({}, emptyStats)
  })

  let groups = new Ember.A();

  items.forEach((item) => {
    let date = get(item, 'date');
    let status = get(item, 'status');

    let group = groups.findBy('date', date);

    // Only one item will be recieved for each status
    if (isPresent(group)) {
      group[status] = item;
    } else {
      group = Object.assign({ date }, emptyDataset);
      group[status] = item;
      groups.push(group);
    }
  });

  // Adding `open` and `resolved` status groups to each hash
  const reducer = (acc, current) => {
    acc.count += get(current, 'count');
    acc.pastDeadlineCount += get(current, 'pastDeadlineCount');
    acc.avgTime += get(current, 'avgTime');
    get(current, 'count') > 0 && acc.itemCount++;
    return acc;
  };

  groups.forEach((group) => {
    group.open = [group['new'], group['in-progress'], group['pending']]
      .reduce(reducer, Object.assign({ itemCount: 0 }, emptyStats));

    group.open.avgTime = Math.floor(group.open.avgTime / group.open.itemCount);

    group.resolved = [group['closed'], group['cancelled']]
      .reduce(reducer, Object.assign({ itemCount: 0 }, emptyStats));

    group.resolved.avgTime = Math.floor(group.resolved.avgTime / group.resolved.itemCount);
  })

  return groups;
}

// Group items by status as a hash and get total counts
// NOTE: will probably be replaced by meta on the payload
const groupByStatus = (items) => {
  let groups = {};

  const emptyStats = {
    count: 0,
    pastDeadlineCount: 0,
  };

  statusList.forEach((status) => {
    groups[status] = Object.assign({ items: [] }, emptyStats)
  })

  items.forEach(function(item) {
    let status = get(item, 'status');
    groups[status].items.push(item);
  });

  const reducer = (acc, current) => {
    acc.count += get(current, 'count');
    acc.pastDeadlineCount += get(current, 'pastDeadlineCount');
    return acc;
  };

  // Add up stats for each status
  statusList.forEach((status) => {
    let group = groups[status];

    if (group.items.length) {
      group = group.items.reduce(reducer, group)
      groups[status] = group;
    }
  })

  // Add up stats for `open` and `resolved`
  groups.open = [groups['new'], groups['in-progress'], groups['pending']].reduce(reducer, Object.assign({}, emptyStats));
  groups.resolved = [groups['closed'], groups['cancelled']].reduce(reducer, Object.assign({}, emptyStats));

  return groups;
}

export default Ember.Controller.extend({
  processedStats: computed('model.@each.count', function() {
    let items = this.get('model');

    let hash = {
      byDate: groupByDate(items),
      byStatus: groupByStatus(items),
    };

    hash.totalCount = hash.byStatus.open.count + hash.byStatus.closed.count;

    return hash;
  })
});
