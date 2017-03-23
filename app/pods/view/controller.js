import Ember from 'ember';
import { typeList, typeMap } from 'id2-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';

export default Ember.Controller.extend({
  typeList,
  typeMap,
  countries,

  title: Ember.computed('model.type', function () {
    switch (this.get('model.type')) {
      case typeList[0]:
        return this.get('model.displayName');
      case typeList[1]:
        return this.get('model.companyName');
      case typeList[2]:
        return 'Request';
    }
  }),

  actions: {
    cancelTicket() {
      let model = this.get('model');

      model.set('status', 'cancelled');
      model.save();
    }
  }
});
