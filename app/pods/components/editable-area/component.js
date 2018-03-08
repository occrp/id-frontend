import { inject as service } from '@ember/service';
import Component from '@ember/component';
import formBufferProperty from 'ember-validated-form-buffer';
import { task } from 'ember-concurrency';


export default Component.extend({
  isEditing: false,
  didValidate: false,
  flashMessages: service(),

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
          }, () => {
            this.get('flashMessages').danger('errors.genericRequest');
          });
        }
      });
    },

    toggleEdit() {
      if (this.get('isEditing') === true) {
        // to be replaced with .rollbackAttribute which is under a feature flag :/
        this.get('model').rollbackAttributes();
      } else {
        this.get('data').discardBufferedChanges(this.get('keys'));
      }
      this.toggleProperty('isEditing');
    }
  }

});
