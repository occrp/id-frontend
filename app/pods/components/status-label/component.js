import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  classNames: ['tag', 'tag--status'],
  classNameBindings: ['statusClass'],

  classByStatus: {
    'new': 'tag--new',
    'in-progress': 'tag--progress',
    'pending': 'tag--pending',
    'closed': 'tag--closed',
    'cancelled': 'tag--cancelled'
  },

  statusClass: computed('status', function() {
    return this.get('classByStatus')[this.get('status')];
  })
}).reopenClass({
  positionalParams: ['status']
});
