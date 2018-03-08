import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import countries from 'ember-i18n-iso-countries/langs/en';
import Fuse from 'fuse';

export default Component.extend({
  preloadEmpty: true,

  countriesList: Object.keys(countries).map(function(code) {
    return { code: code, name: countries[code] };
  }),

  suggestedCountries: Object.freeze(['US', 'GB', 'FR', 'ES', 'BA', 'AU']),

  task: task(function * (term) {
    if (isBlank(term)) {
      return this.get('suggestedCountries');
    }

    const fuse = new Fuse(this.get('countriesList'), {
      keys: [{
        name: 'code',
        weight: 0.3
      }, {
        name: 'name',
        weight: 0.7
      }],
      id: 'code'
    });

    const results = yield fuse.search(term);

    return results.slice(0,6);
  }).restartable(),

  didInsertElement() {
    if (this.get('preloadEmpty')) {
      let last = this.get('task.lastSuccessful');
      if (!last || last.args[0] !== '') {
        this.get('task').perform('');
      }
    }

    this.$('input').focus();
  }

});
