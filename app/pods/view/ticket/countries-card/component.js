import { inject as service } from '@ember/service';
import Component from '@ember/component';
import countries from 'i18n-iso-countries';

export default Component.extend({
  countries: countries.getNames('en'),
  flashMessages: service(),

  selectedCountry: null,

  actions: {
    addCountry() {
      const model = this.get('model');
      let countries = model.get('countries') || [];

      countries.push(this.get('selectedCountry'));
      countries = countries.uniq();

      model.set('countries', countries);

      if (model.get('isValid')) {
        model.save().then(()=> {
          this.set('selectedCountry', null);
        }).catch(() => {
          this.get('flashMessages').danger('errors.genericRequest');
        });
      }
    },

    removeCountry(code) {
      const model = this.get('model');

      model.get('countries').removeObject(code);

      if (model.get('isValid')) {
        model.save().catch(() => {
          this.get('flashMessages').danger('errors.genericRequest');
        });
      }
    }
  }
});
