import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id2-frontend/models/user';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  searchStaff: task(getSearchGenerator({isStaff: true})).restartable(),

  updateResponder: task(function * (model, user) {
    let record = this.get('store').createRecord('responder', {
      ticket: model,
      user: user
    });
    yield record.save();
  }),

  removeResponder: task(function * (record) {
    yield record.destroyRecord();
  }),

  updateStatus: task(function * (newStatus) {
    let model = this.get('model');

    model.set('status', newStatus);
    yield model.save();
  }),

  actions: {
    selectUser(model, user) {
      this.get('updateResponder').perform(model, user).then(() => {
        this.get('model').hasMany('activities').reload();
      });
    },

    removeUser(responder) {
      this.get('removeResponder').perform(responder).then(() => {
        this.get('model').hasMany('activities').reload();
      });
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
