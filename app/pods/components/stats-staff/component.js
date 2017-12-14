import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed } = Ember;

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
  }
});
