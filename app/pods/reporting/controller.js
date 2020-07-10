import moment from 'moment';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['startAt', 'by'],

  selectedStartAt: moment.utc().startOf('month').subtract(1, 'months'),

  selectedStartAtDidChange: function() {
    this.set(
      'startAt',
      moment(this.get('selectedStartAt')).toISOString().slice(0, -5)
    );
  }.observes('selectedStartAt')
});
