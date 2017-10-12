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
    }
  }

});
