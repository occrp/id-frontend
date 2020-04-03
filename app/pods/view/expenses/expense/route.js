import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    const ticket = this.modelFor('view.expenses');

    return ticket.get('expenses').findBy('id', params.expense_id);
  }
});
