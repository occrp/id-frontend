import Ember from 'ember';
import { kindMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  kindMap,

  hasFilters: Ember.computed.or('requester', 'responder', 'kind'),

  // fyi, these CPs will get triggered twice per change.
  // first when we manually update filterMeta.${key} in the controller
  // second when the model refreshes and filterMeta is changed

  currentRequester: Ember.computed('requester', 'filterMeta.requester', function() {
    return this.get('requester') && this.get('filterMeta.requester');
  }),

  currentResponder: Ember.computed('responder', 'filterMeta.responder', function() {
    if (this.get('responder') === 'none') {
      return { firstName: 'none' };
    }

    return this.get('responder') && this.get('filterMeta.responder');
  })

});
