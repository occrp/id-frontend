import { computed } from '@ember/object';
import intl from 'ember-intl/services/intl';
import ENV from 'id-frontend/config/environment';

export default intl.extend({
  isRtl: computed('locale', function() {
    return ENV.intl.rtlLocales.indexOf(this.get('locale')) >= 0;
  }),
});
