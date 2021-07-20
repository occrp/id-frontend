import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  flashMessages: service(),
  requireSession: false,

  queryParams: {
    token: true
  },

  // Do not require authentication
  buildRouteInfoMetadata() {
    return { requireSession: false }
  },

  model(params) {
    // Don't load the model, it's not available!
    let ticket = this.get('store').createRecord(
      'ticket', { id: params.ticket_id }
    );

    return this.get('store').createRecord(
      'review', { ticket: ticket, token: params.token }
    );
  },

  deactivate() {
    this.get('flashMessages').clearMessages();
  }
});

