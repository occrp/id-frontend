import Ember from 'ember';
import { Validations } from 'id-frontend/models/subscriber';
import { task } from 'ember-concurrency';
import formBufferProperty from 'ember-validated-form-buffer';

export default Ember.Component.extend({
  tagName: '',
  store: Ember.inject.service(),
  didValidate: false,

  init() {
    this.set('record', this.get('store').createRecord('subscriber'));
    this._super(arguments);
  },

  buffer: formBufferProperty('record', Validations),

  addSubscriber: task(function * () {
    let record = this.get('record');
    record.set('ticket', this.get('ticket'));
    yield record.save();
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