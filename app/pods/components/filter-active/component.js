import Ember from 'ember';
import { kindMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  kindMap,

  hasFilters: Ember.computed.or('requester', 'assignee', 'kind'),

  // fyi, these CPs will get triggered twice per change.
  // first when we manually update filterMeta.${key} in the controller
  // second when the model refreshes and filterMeta is changed

  currentRequester: Ember.computed('requester', 'filterMeta.requester', function() {
    return this.get('requester') && this.get('filterMeta.requester');
  }),

  currentAssignee: Ember.computed('assignee', 'filterMeta.assignee', function() {
    if (this.get('assignee') === 'none') {
      return { firstName: 'none' };
    }

    return this.get('assignee') && this.get('filterMeta.assignee');
  })

});
