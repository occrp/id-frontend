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

  setupController (controller, model) {
    this._super(controller, model);
    controller.set('ticket', this.modelFor('view'));
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
