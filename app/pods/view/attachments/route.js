import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const ticket = this.modelFor('view');

    return this.get('store').query('attachment', {
      filter: {
        ticket: ticket.id
      },
      include: 'user'
    }).then(function() {
      return ticket;
    });
  }
});
