import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import ProfileDecorator from 'id-frontend/mixins/profile-decorator';

const wrapper = EmberObject.extend(ProfileDecorator);

export default Component.extend({
  tagName: '',
  intl: service(),
  hasFilters: or('requester', 'responder', 'kind', 'country'),

  // fyi, these CPs will get triggered twice per change.
  // first when we manually update filterMeta.${key} in the controller
  // second when the model refreshes and filterMeta is changed

  currentRequester: computed('requester', 'filterMeta.requester', function() {
    return this.get('requester') && wrapper.create(this.get('filterMeta.requester'));
  }),

  currentResponder: computed('responder', 'filterMeta.responder', 'intl.locale', function() {
    if (this.get('responder') === 'none') {
      return wrapper.create({
        email: this.get('intl').t('ticket.responder.empty')
      });
    }

    return this.get('responder') && wrapper.create(this.get('filterMeta.responder'));
  })

});
