import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').findRecord('ticket', params.ticket_id, {
      include: 'requester,responders,responders.user,subscribers,subscribers.user,attachments,attachments.user',
      reload: true
    });
  }
});
