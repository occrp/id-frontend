import Ember from 'ember';
import { kindMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  kindMap,

  hasFilters: Ember.computed.or('author', 'assignee', 'kind'),

  // fyi, these CPs will get triggered twice per change.
  // first when we manually update filterMeta.${key} in the controller
  // second when the model refreshes and filterMeta is changed

  currentAuthor: Ember.computed('author', 'filterMeta.author', function() {
    return this.get('author') && this.get('filterMeta.author');
  }),

  currentAssignee: Ember.computed('assignee', 'filterMeta.assignee', function() {
    if (this.get('assignee') === 'none') {
      return { firstName: 'none' };
    }

    return this.get('assignee') && this.get('filterMeta.assignee');
  })

});
