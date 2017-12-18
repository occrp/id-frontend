import Ember from 'ember';
import moment from 'moment';

const { computed } = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),

  queryParams: ['startAt'],

  startAtOptions: computed(function() {
    const i18n = this.get('i18n');
    return [
      {
        value: moment.utc().startOf('month').subtract(3, 'months').toISOString().slice(0, -5),
        label: i18n.t('pods.reporting.dateRange.lastQuarter')
      },
      {
        value: moment.utc().startOf('month').subtract(6, 'months').toISOString().slice(0, -5),
        label: i18n.t('pods.reporting.dateRange.lastHalf')
      },
      {
        value: moment.utc().startOf('month').subtract(12, 'months').toISOString().slice(0, -5),
        label: i18n.t('pods.reporting.dateRange.lastYear')
      }
    ];
  }),

  startAt: computed.reads('startAtOptions.firstObject.value'),
});
