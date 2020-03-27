import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').findRecord('ticket', params.ticket_id, {
      include: 'attachments,attachments.user',
      reload: true
    });
  }
});
