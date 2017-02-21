import Ember from 'ember';

const {
  computed,
} = Ember;

export default Ember.Component.extend({
  classNameBindings: ['showErrors:has-error'],

  showValidations: false,
  showMessages: computed.or('didValidate', 'showValidations'),
  showErrors: computed.and('showMessages', 'validation.isInvalid'),

  actions: {
    triggerValidations() {
      this.set('showValidations', true);
    }
  }
});
