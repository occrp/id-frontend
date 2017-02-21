import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    }
  },

  model(params) {
    return this.get('store').query('ticket', {
      filter: { ticket: params },
    });
  }
});
