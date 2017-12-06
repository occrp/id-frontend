import Ember from 'ember';
import $ from 'jquery';
import ENV from 'id-frontend/config/environment';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  moment: Ember.inject.service(),

  queryParams: ['lang'],

  activeLocales: ENV.i18n.activeLocales,

  // no other way to add classes/attrs to the root element afaict
  manageRtlAttrs(locale) {
    const $root = $(ENV.APP.rootElement);
    if (ENV.i18n.rtlLocales.indexOf(locale) >= 0) {
      $root.addClass('is-rtl');
      $root.attr('dir', 'rtl');
    } else {
      $root.removeClass('is-rtl');
      $root.removeAttr('dir');
    }
  },

  lang: Ember.computed('i18n.locale', {
    get() {
      return this.get('i18n.locale');
    },
    set(key, value) {
      this.set('i18n.locale', value);
      this.get('moment').setLocale(value);
      this.manageRtlAttrs(value);
      return value;
    }
  }),

  actions: {
    switchLocale(locale) {
      this.set('lang', locale);
    }
  }
});
