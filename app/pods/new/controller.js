import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    goToTicketPage(model) {
      this.transitionToRoute("browse"/*, model*/);
    }
  }
});
