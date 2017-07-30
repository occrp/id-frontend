import Ember from 'ember';
import { kindList } from 'id2-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';

export default Ember.Controller.extend({
  kindList,
  countries,

  title: Ember.computed('model.kind', function () {
    switch (this.get('model.kind')) {
      case kindList[2]:
        return 'Request';
      default:
        return this.get('model.displayName');
    }
  })

});
