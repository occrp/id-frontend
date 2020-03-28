import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    goToExpensePage(expense) {
      this.transitionToRoute('view.expenses.expense', expense);
    }
  }
});
