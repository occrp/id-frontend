import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    }
  },

  model(params) {
    const ticket = this.modelFor('view');

    return this.get('store').query('attachment', {
      filter: {
        ticket: ticket.id
      },
      page: {
        number: params.page,
        size: params.size
      },
      include: 'user'
    });
  },

  actions: {
    refreshModel() {
      this.refresh();
    }
  }
});
