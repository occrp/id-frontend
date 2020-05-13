import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import countries from 'i18n-iso-countries';
import Fuse from 'fuse';

export default Component.extend({
  preloadEmpty: true,

  countriesList: computed(function() {
    const hash = countries.getNames('en');
    return Object.keys(hash).map((code) => {
      return { code, name: hash[code] };
    });
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

    return results.map(r => r.item.code).slice(0,6);
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
