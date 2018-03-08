import { or, and } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: ['showErrors:is-invalid'],

  showValidations: false,
  showMessages: or('didValidate', 'showValidations'),
  showErrors: and('showMessages', 'errors.length'),

  actions: {
    triggerValidations() {
      this.set('showValidations', true);
    }
  }
});
