import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    this.get('task').perform('');

    this.$('input').focus();
  },

  actions: {
    select(user) {
      this.get('onSelect')(user);
      this.get('close')();
    }
  }
});
