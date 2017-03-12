import Ember from 'ember';

export default Ember.Component.extend({
  isStaff: false,

  didInsertElement() {
    this.get('task').perform(this.get('isStaff'), '');

    this.$('input').focus();
  },

  actions: {
    select(user) {
      this.get('onSelect')(user);
      this.get('close')();
    }
  }
});
