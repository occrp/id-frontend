import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import groupByDate from 'id-frontend/pods/reporting/group-by-date';

export default Component.extend({
  tagName: '',
  store: service(),

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
