import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  can: service(),

  queryParams: {
    startAt: {
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
    return this.get('store').query('ticket-stats', {
      filter: {
        startAt: params.startAt
      },
    });
  }
});
