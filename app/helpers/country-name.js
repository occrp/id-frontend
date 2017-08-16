import Ember from 'ember';
import { getName } from 'ember-i18n-iso-countries';

export function countryName([code]) {
  return getName(code, 'en');
}

export default Ember.Helper.helper(countryName);
