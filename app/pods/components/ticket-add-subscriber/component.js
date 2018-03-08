import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { Validations } from 'id-frontend/models/subscriber';
import { task } from 'ember-concurrency';
import formBufferProperty from 'ember-validated-form-buffer';

export default Component.extend({
  tagName: '',
  store: service(),
  flashMessages: service(),
  didValidate: false,

  init() {
    this.set('record', this.get('store').createRecord('subscriber'));
    this._super(arguments);
  },

  buffer: formBufferProperty('record', Validations),

  addSubscriber: task(function * () {
    let record = this.get('record');
    record.set('ticket', this.get('ticket'));

    try {
      yield record.save();
    } catch (e) {
      record.rollbackAttributes();
      this.get('flashMessages').danger('errors.genericRequest');
    }
  }),

  actions: {
    save() {
      const buffer = this.get('buffer');
      const afterSave = this.get('afterSave');

      buffer.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          buffer.applyChanges();
          this.get('addSubscriber').perform().then(() => {
            afterSave();
            this.set('didValidate', false);
            this.set('record', this.get('store').createRecord('subscriber'));
          });
        }
      });
    }
  }
});
