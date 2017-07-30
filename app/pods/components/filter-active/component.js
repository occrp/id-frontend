import Ember from 'ember';
import ProfileDecorator from 'id2-frontend/mixins/profile-decorator';

const wrapper = Ember.Object.extend(ProfileDecorator);

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  hasFilters: Ember.computed.or('requester', 'responder', 'kind'),

  // fyi, these CPs will get triggered twice per change.
  // first when we manually update filterMeta.${key} in the controller
  // second when the model refreshes and filterMeta is changed

  currentRequester: Ember.computed('requester', 'filterMeta.requester', function() {
    return this.get('requester') && wrapper.create(this.get('filterMeta.requester'));
  }),

  currentResponder: Ember.computed('responder', 'filterMeta.responder', function() {
    if (this.get('responder') === 'none') {
      return wrapper.create({
        email: this.get('i18n').t('ticket.responder.empty')
      });
    }

    return this.get('responder') && wrapper.create(this.get('filterMeta.responder'));
  })

});
