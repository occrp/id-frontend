import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'i',
  classNames: ['fa'],
  classNameBindings: ['kindIcon'],

  iconByKind: {
    'person_ownership': 'fa-user',
    'company_ownership': 'fa-building',
    'other': 'fa-question'
  },

  kindIcon: Ember.computed('kind', function() {
    return this.get('iconByKind')[this.get('kind')];
  })
}).reopenClass({
  positionalParams: ['kind']
});
