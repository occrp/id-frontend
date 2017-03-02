import Ember from 'ember';
import { typeList, typeMap } from 'id2-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';

export default Ember.Controller.extend({
  typeList,
  typeMap,
  countries,

  actions: {
    cancelTicket() {
      let model = this.get('model');

      model.set('status', 'cancelled');
      model.save();

      this.set('isShowingModal', false)
    }
  }
});
