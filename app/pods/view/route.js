import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('store').findRecord('ticket', params.ticket_id, {
      include: 'requester,responder,activities,activities.author',
      reload: true
    });
  }
});
