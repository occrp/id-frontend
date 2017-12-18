import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'tr',
  store: Ember.inject.service(),

  statsCache: null,

  loadStats: task(function * (countryId) {
    let records = yield this.get('store').query('ticket-stats', {
      filter: {
        'country': countryId
      }
    });

    return records;
  }).group('group'),

  didReceiveAttrs() {
    this.get('loadStats').perform(this.get('country')).then((records) => {
      this.set('statsCache', records);
    });
  }
});
