import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['tag', 'tag--status'],
  classNameBindings: ['statusClass'],

  classByStatus: {
    'new': 'tag--new',
    'in-progress': 'tag--progress',
    'closed': 'tag--closed',
    'cancelled': 'tag--cancelled'
  },

  statusClass: Ember.computed('status', function() {
    return this.get('classByStatus')[this.get('status')];
  })
}).reopenClass({
  positionalParams: ['status']
});
