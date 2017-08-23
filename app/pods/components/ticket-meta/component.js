import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id-frontend/models/profile';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  updateResponder: task(function * (ticket, user) {
    let record = this.get('store').createRecord('responder', {
      ticket,
      user
    });
    yield record.save();
  }),

  removeResponder: task(function * (responder) {
    yield responder.destroyRecord();
  }),

  updateStatus: task(function * (newStatus, comment) {
    let model = this.get('model');

    model.set('status', newStatus);

    if (comment) {
      const attr = newStatus === 'pending' ? 'pendingReason' : 'reopenReason';
      model.set(attr, comment);
    }

    yield model.save();
  }),

  actions: {
    selectUser(ticket, user) {
      this.get('updateResponder').perform(ticket, user).then(() => {
        // Reloading the model too since the status will change
        // when adding the first responder
        ticket.reload();
        ticket.hasMany('activities').reload();
      });
    },

    removeUser(responder) {
      this.get('removeResponder').perform(responder).then(() => {
        this.get('model').hasMany('activities').reload();
      });
    },

    saveStatus(activityType, comment) {
      const mapToStatus = {
        'close': 'closed',
        'cancel': 'cancelled',
        'reopen': 'in-progress',
        'pending': 'pending'
      };
      this.get('updateStatus').perform(mapToStatus[activityType], comment).then(() => {
        this.get('model').hasMany('activities').reload();
      });
    }
  }

});
