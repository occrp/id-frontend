import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  can: service(),

  beforeModel() {
    const ticket = this.modelFor('view');
    const result = this._super(...arguments);

    if (!this.get('can').can('resolve tickets')) {
      return this.transitionTo('view', ticket);
    }

    return result;
  },

  model() {
    const ticket = this.modelFor('view');

    return this.get('store').query('expense', {
      filter: {
        ticket: ticket.id
      },
      include: 'user'
    }).then(function() {
      return ticket;
    });
  }
});
