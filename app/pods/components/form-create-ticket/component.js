import Ember from 'ember';
import { kindList, Validations } from 'id-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import moment from 'moment';

export default Ember.Component.extend({
  kindList,
  countries,

  today: moment(),
  minimumDeadline: moment().add(3, 'days'),

  buffer: Ember.computed('model', function() {
    let model = this.get('model');
    let injection = Ember.getOwner(this).ownerInjection();

    return BufferedProxy.extend(Validations).create(injection, {
      content: model
    });
  }),

  didValidate: false,

  actions: {

    changeKind(value) {
      this.get('buffer').discardBufferedChanges();
      this.set('buffer.kind', value);
      this.set('didValidate', false);
    },

    save() {
      let afterSave = this.get('afterSave');
      let buffer = this.get('buffer');
      let model = this.get('model');

      buffer.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          buffer.applyChanges();
          model.save().then(model => {
            afterSave(model);
          });
        }

      });
    }

  }
});
