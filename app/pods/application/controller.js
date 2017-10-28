import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  moment: Ember.inject.service(),
  queryParams: ['lang'],

  lang: Ember.computed({
    get() {
      return this.get('i18n.locale');
    },
    set(key, value) {
      this.set('i18n.locale', value);
      this.get('moment').setLocale(value);
      return value;
    }
  }),

  actions: {
    switchLocale(locale) {
      this.set('lang', locale);
    }
  }
});
