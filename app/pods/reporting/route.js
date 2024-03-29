import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Route.extend({
  can: service(),

  queryParams: {
    statsType: {
      refreshModel: true
    },
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

    if (isBlank(params.statsType)) {
      params.statsType = 'ticket-stats';
    }


    if (params.by === 'ticket') {
      includes = 'ticket';
    } else if (params.by === 'responder') {
      includes = 'responder';
    }

    return this.get('store').query(params.statsType, {
      filter: {
        startAt: params.startAt,
        by: params.by
      },
      include: includes
    });
  }
});
