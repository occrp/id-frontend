import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    goToTicketPage(model) {
      this.transitionToRoute("view", model);
    }
  }
});
