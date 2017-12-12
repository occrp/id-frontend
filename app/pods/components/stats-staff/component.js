import Ember from 'ember';
import { task } from 'ember-concurrency';
import { statusList } from 'id-frontend/models/ticket';

const { computed, get } = Ember;

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


export default Ember.Component.extend({
  tagName: 'tr',
  store: Ember.inject.service(),

  statsCache: null,
  user: null,

  loadStats: task(function * (profileId) {
    let records = yield this.get('store').query('ticket-stats', {
      filter: {
        'profile': profileId
      },
      include: 'profile'
    });

    return records;
  }).group('group'),

  didReceiveAttrs() {
    this.get('loadStats').perform(this.get('profile')).then((records) => {
      this.set('statsCache', records);
      this.set('user', this.get('store').peekRecord('profile', this.get('profile')));
    });
  },

  processedStats: computed('statsCache', function() {
    let items = this.get('statsCache');

    if (!items) {
      return false;
    }

    let hash = {
      byStatus: groupByStatus(items),
    };

    hash.totalCount = hash.byStatus.open.count + hash.byStatus.closed.count;

    return hash;
  })
});
