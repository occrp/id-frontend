import Ember from 'ember';
import { task } from 'ember-concurrency';
import groupByDate from 'id-frontend/pods/reporting/group-by-date';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: '',
  store: Ember.inject.service(),

  statsCache: null,
  processedStats: null,

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
      this.set('processedStats', groupByDate(records));
    });
  }
});
