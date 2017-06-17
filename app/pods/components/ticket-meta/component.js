import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id2-frontend/models/user';

export default Ember.Component.extend({
  searchStaff: task(getSearchGenerator({isStaff: true})).restartable(),

  updateResponder: task(function * (model, user) {
    model.set('responder', user);
    yield model.save();
  }),

  updateStatus: task(function * (newStatus) {
    let model = this.get('model');

    model.set('status', newStatus);
    yield model.save();
  }),

  actions: {
    selectUser(model, user) {
      this.get('updateResponder').perform(model, user);
    },

    saveStatus(activityType) {
      let mapToStatus = {
        'close': 'closed',
        'cancel': 'cancelled'
      };
      this.get('updateStatus').perform(mapToStatus[activityType]).then(() => {
        this.get('model').hasMany('activities').reload();
      });
    }
  }

});
