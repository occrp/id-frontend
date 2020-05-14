import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  intl: service(),

  queryParams: ['startAt'],

  startAtOptions: computed(function() {
    const intl = this.get('intl');
    return [
      {
        value: moment.utc().startOf('month').subtract(3, 'months').toISOString().slice(0, -5),
        label: intl.t('pods.reporting.dateRange.lastQuarter')
      },
      {
        value: moment.utc().startOf('month').subtract(6, 'months').toISOString().slice(0, -5),
        label: intl.t('pods.reporting.dateRange.lastHalf')
      },
      {
        value: moment.utc().startOf('month').subtract(12, 'months').toISOString().slice(0, -5),
        label: intl.t('pods.reporting.dateRange.lastYear')
      }
    ];
  }),

  startAt: reads('startAtOptions.firstObject.value'),
});
