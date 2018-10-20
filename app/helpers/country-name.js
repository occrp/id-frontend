import { helper } from '@ember/component/helper';
import countries from 'i18n-iso-countries';

export function countryName([code]) {
  return countries.getName(code, 'en');
}

export default helper(countryName);
