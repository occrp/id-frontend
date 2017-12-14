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
    let count = get(item, 'count');

    let group = groups.findBy('date', date);

    // Only one item will be recieved for each status
    if (isPresent(group)) {
      group[status] = item;
      group.totalCount += count;
    } else {
      group = Object.assign({ date, totalCount: count }, emptyDataset);
      group[status] = item;
      groups.push(group);
    }
  });

  groups.sort((a, b) => {
    const c = new Date(a.date).getTime();
    const d = new Date(b.date).getTime();

    if (c > d) {
      return -1;
    }
    if (c < d) {
      return 1;
    }
    return 0;
  })

  return groups;
}

export default Ember.Controller.extend({
  processedStats: computed('model.@each.count', function() {
    let items = this.get('model');

    return groupByDate(items);
  }),

  total: Ember.computed.reads('model.meta.total')
});
