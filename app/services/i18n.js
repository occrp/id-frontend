import Ember from 'ember';
import i18n from 'ember-i18n/services/i18n';
import ENV from 'id-frontend/config/environment';

export default i18n.extend({
  isRtl: Ember.computed('locale', function() {
    return ENV.i18n.rtlLocales.indexOf(this.get('locale')) >= 0;
  }),
});
