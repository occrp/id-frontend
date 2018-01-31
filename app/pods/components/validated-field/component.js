import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  classNameBindings: ['showErrors:is-invalid'],

  showValidations: false,
  showMessages: computed.or('didValidate', 'showValidations'),
  showErrors: computed.and('showMessages', 'errors.length'),

  actions: {
    triggerValidations() {
      this.set('showValidations', true);
    }
  }
});
