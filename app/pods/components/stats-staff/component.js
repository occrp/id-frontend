import Ember from 'ember';
import { task } from 'ember-concurrency';
import groupByDate from 'id-frontend/pods/reporting/group-by-date';

export default Ember.Component.extend({
  tagName: '',
  store: Ember.inject.service(),

  statsCache: null,
  user: null,
  processedStats: null,

  loadStats: task(function * (profileId) {
    const filter = Object.assign({
      'profile': profileId
    }, this.get('filter'));

    const records = yield this.get('store').query('ticket-stats', {
      filter,
      include: 'profile'
    });

    return records;
  }).group('group'),

  didReceiveAttrs() {
    this.get('loadStats').perform(this.get('profile')).then((records) => {
      this.set('statsCache', records);
      this.set('processedStats', groupByDate(records));
      this.set('user', this.get('store').peekRecord('profile', this.get('profile')));
    });
  }
});
