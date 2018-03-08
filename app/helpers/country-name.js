import { helper } from '@ember/component/helper';
import { getName } from 'ember-i18n-iso-countries';

export function countryName([code]) {
  return getName(code, 'en');
}

export default helper(countryName);
