import Ember from 'ember';
import { typeList } from 'id2-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';

export default Ember.Controller.extend({
  typeList,
  countries
});
