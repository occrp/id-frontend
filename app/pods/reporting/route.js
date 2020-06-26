import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Route.extend({
  can: service(),

  queryParams: {
    monthsAgo: {
      refreshModel: true
    }
  },

  beforeModel() {
    let result = this._super(...arguments);

    if (!this.get('can').can('manage tickets')) {
      return this.transitionTo('index');
    }

    return result;
  },

  model(params) {
    let startAt = moment.utc()
      .startOf('month')
      .subtract(params.monthsAgo, 'months')
      .toISOString()
      .slice(0, -5);

    return this.get('store').query('ticket-stats', {
      filter: {
        startAt: startAt
      },
    });
  }
});
