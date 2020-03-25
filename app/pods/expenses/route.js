import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    let result = this._super(...arguments);

    if (!this.get('can').can('manage tickets')) {
      return this.transitionTo('index');
    }

    return result;
  },

  model(params) {
    return this.get('store').findRecord('ticket', params.ticket_id, {
      include: 'requester,responders,responders.user,subscribers,subscribers.user,attachments,attachments.user',
      reload: true
    });
  }
});
