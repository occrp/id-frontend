import { computed } from '@ember/object';
import i18n from 'ember-i18n/services/i18n';
import ENV from 'id-frontend/config/environment';

export default i18n.extend({
  isRtl: computed('locale', function() {
    return ENV.i18n.rtlLocales.indexOf(this.get('locale')) >= 0;
  }),
});
