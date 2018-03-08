import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  i18n: service(),

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

  startAt: reads('startAtOptions.firstObject.value'),
});
