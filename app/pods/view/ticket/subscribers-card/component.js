import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { relRemovalGenerator } from '../responders-card/component';

export default Component.extend({
  i18n: service(),
  store: service(),
  session: service(),
  flashMessages: service(),
  activityBus: service(),
  isExpanded: null,

  removeSubscriber: task(relRemovalGenerator),

  actions: {
    // task handled inside the dedicated component
    afterAddSubscriber() {
      this.get('activityBus').trigger('reload');
    },

    removeSubscriber(subscriber) {
      this.get('removeSubscriber').perform(subscriber).then(() => {
        this.get('activityBus').trigger('reload');
      });
    },
  }
});
