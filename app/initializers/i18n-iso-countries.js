import countries from 'i18n-iso-countries';
import en from 'countries-en';

export function initialize(/* application */) {
  countries.registerLocale(en);
}

export default {
  initialize
};
