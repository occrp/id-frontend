import Component from '@ember/component';
import { kindList, Validations } from 'id-frontend/models/ticket';
import formBufferProperty from 'ember-validated-form-buffer';
import countries from 'i18n-iso-countries';
import moment from 'moment';
import { task } from 'ember-concurrency';

export default Component.extend({
  kindList,
  countries: countries.getNames('en'),

  today: moment.utc(),
  minimumDeadline: moment.utc().add(3, 'days'),

  buffer: formBufferProperty('model', Validations),

  didValidate: false,

  saveRecord: task(function * () {
    yield this.get('model').save();
  }),

  actions: {
    changeKind(value) {
      this.get('buffer').discardBufferedChanges();
      this.set('buffer.kind', value);
      this.set('didValidate', false);
    },

    save() {
      const buffer = this.get('buffer');
      const model = this.get('model');
      const afterSave = this.get('afterSave');

      buffer.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          buffer.applyChanges();
          this.get('saveRecord').perform().then(() => {
            afterSave(model);
          });
        }

      });
    }
  }
});
