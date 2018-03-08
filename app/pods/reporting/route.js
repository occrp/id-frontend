import Route from '@ember/routing/route';
import { CanMixin } from 'ember-can';

export default Route.extend(CanMixin, {
  queryParams: {
    startAt: {
      refreshModel: true
    }
  },

  beforeModel() {
    let result = this._super(...arguments);

    if (!this.can('manage tickets')) {
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
