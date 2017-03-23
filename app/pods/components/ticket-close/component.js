import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  isShowingModal: false,

  publishActivity: task(function * () {
    let record = this.get('store').createRecord('activity', {
      type: this.get('activityType'),
      ticket: this.get('model'),
      author: this.get('session.currentUser')
    });
    yield record.save();
  }),

  actions: {
    save() {
      this.get('publishActivity').perform().then(() => {
        this.set('isShowingModal', false);
        this.get('model').reload();
      });
    }
  }

});
