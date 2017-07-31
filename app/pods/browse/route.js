import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    },
    kind: {
      refreshModel: true
    },
    sort: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    },
    requester: {
      refreshModel: true
    },
    responders: {
      refreshModel: true
    }
  },

  model(params) {
    return this.get('store').query('ticket', {
      filter: {
        status: params.status,
        kind: params.kind,
        requester: params.requester,
        responders: params.responders
      },
      page: {
        number: params.page,
        size: params.size
      },
      sort: params.sort,
      include: 'requester,responders,responders.user'
    });
  }
});
