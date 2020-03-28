import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  flashMessages: service(),

  model(params) {
    return this.get('store').findRecord('ticket', params.ticket_id, {
      include: 'requester,responders,responders.user,subscribers,subscribers.user,attachments,attachments.user,expenses,expenses.user',
      reload: true
    });
  },

  // Force reload activities relationship on repeated visits
  // The first load remains cached since the rel ids aren't serialized
  afterModel(model) {
    let ref = model.hasMany('activities');
    if (ref.value() !== null) {
      ref.reload();
    }
  },

  deactivate() {
    this.get('flashMessages').clearMessages();
  }
});
