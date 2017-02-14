import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').createRecord('ticket');
  },
  deactivate() {
    this.currentModel.rollbackAttributes();
  }
});
