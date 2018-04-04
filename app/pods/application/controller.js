import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import $ from 'jquery';
import ENV from 'id-frontend/config/environment';

export default Controller.extend({
  i18n: service(),
  moment: service(),
  session: service(),

  queryParams: ['lang'],

  activeLocales: ENV.i18n.activeLocales,
  parentMeta: ENV.options,

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

  lang: computed('i18n.locale', {
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
