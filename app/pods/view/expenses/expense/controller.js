import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    goToExpensesPage(ticket) {
      this.transitionToRoute('view.expenses', ticket);
    }
  }
});
