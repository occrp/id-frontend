import Ember from 'ember';
import { task } from 'ember-concurrency';
import groupByDate from 'id-frontend/pods/reporting/group-by-date';

export default Ember.Component.extend({
  tagName: '',
  store: Ember.inject.service(),

  statsCache: null,
  processedStats: null,

  loadStats: task(function * (countryId) {
    const filter = Object.assign({
      'country': countryId
    }, this.get('filter'));

    const records = yield this.get('store').query('ticket-stats', {
      filter
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
