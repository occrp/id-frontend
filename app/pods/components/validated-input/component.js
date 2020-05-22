import Component from '@ember/component';

export default Component.extend({
  buffer: null,
  label: null,
  desc: null,
  defaultField: false,
  inputId: null,
  inputClass: null,
  showErrors: true,
  required: false,

  actions: {
    validateProperty(changeset, property) {
      return changeset.validate(property);
    }
  }
});
