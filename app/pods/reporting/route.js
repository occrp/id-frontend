import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Route.extend({
  can: service(),

  queryParams: {
    startAt: {
      refreshModel: true
    },
    by: {
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
    let includes = null;

    if (params.by === 'responder') {
      includes = 'responder';
    }

    return this.get('store').query('ticket-stats', {
      filter: {
        startAt: params.startAt,
        by: params.by
      },
      include: includes
    });
  }
});
