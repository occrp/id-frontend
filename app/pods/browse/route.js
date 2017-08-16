import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    },
    country: {
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
    responder: {
      refreshModel: true
    }
  },

  model(params) {
    return this.get('store').query('ticket', {
      filter: {
        status: params.status,
        country: params.country,
        kind: params.kind,
        requester: params.requester,
        responder: params.responder
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
