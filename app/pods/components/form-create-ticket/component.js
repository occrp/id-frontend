import Ember from 'ember';
import { typeList } from 'id2-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import moment from 'moment';

export default Ember.Component.extend({
  typeList,
  countries,

  today: moment(),

  buffer: Ember.computed('model', function() {
    let model = this.get('model');

    return BufferedProxy.create({ content: model });
  }),

  actions: {
    save() {
      let afterSave = this.get('afterSave');

      this.get('buffer').applyChanges();
      this.get('model').save().then(model => {
        afterSave(model);
      });
    }
  }
});
