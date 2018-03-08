import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'i',
  classNames: ['fa'],
  classNameBindings: ['kindIcon'],

  iconByKind: Object.freeze({
    'person_ownership': 'fa-user',
    'company_ownership': 'fa-building',
    'other': 'fa-question'
  }),

  kindIcon: computed('kind', function() {
    return this.get('iconByKind')[this.get('kind')];
  })
}).reopenClass({
  positionalParams: ['kind']
});
