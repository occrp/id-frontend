import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    },
    search: {
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
    },
    startDate: {
      refreshModel: true
    }
  },

  afterModel(transition) {
    const controller = this.controllerFor(this.get('routeName'));
    controller.set('csvExportParams', transition.query);
  },

  model(params) {
    return this.get('store').query('ticket', {
      filter: {
        status: params.status,
        country: params.country,
        kind: params.kind,
        requester: params.requester,
        responder: params.responder,
        search: params.search,
        created_at__gte: params.startDate
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
