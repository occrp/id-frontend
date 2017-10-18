import Ember from 'ember';
import formBufferProperty from 'ember-validated-form-buffer';
import { task } from 'ember-concurrency';


export default Ember.Component.extend({
  isEditing: false,
  didValidate: false,

  init() {
    this._super();
    const validations = this.get('validations');
    this.set('data', formBufferProperty('model', validations));
  },

  saveRecord: task(function * () {
    yield this.get('model').save();
  }),

  actions: {
    save() {
      const data = this.get('data');

      data.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          data.applyBufferedChanges(this.get('keys'));
          this.get('saveRecord').perform().then(() => {
            this.toggleProperty('isEditing');
          });
        }
      });
    },

    toggleEdit() {
      if (this.get('isEditing') === true) {
        this.get('data').discardBufferedChanges();
      }
      this.toggleProperty('isEditing');
    }
  }

});
