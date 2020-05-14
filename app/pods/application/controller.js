import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import ENV from 'id-frontend/config/environment';

export default Controller.extend({
  intl: service(),
  moment: service(),
  session: service(),

  queryParams: ['lang'],

  activeLocales: ENV.intl.activeLocales,
  parentMeta: ENV.options,

  // no other way to add classes/attrs to the root element afaict
  manageRtlAttrs(locale) {
    const root = document.querySelector(ENV.APP.rootElement);

    if (ENV.intl.rtlLocales.indexOf(locale) >= 0) {
      root.classList.add('is-rtl');
      root.dir = 'rtl';
    } else {
      root.classList.remove('is-rtl');
      root.dir = '';
    }
  },

  lang: computed('intl.locale', {
    get() {
      return this.get('intl.locale');
    },
    set(key, value) {
      this.set('intl.locale', value);
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
