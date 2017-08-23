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

    if (ticket.get('status') === 'new') {
      yield this.get('data').update();
    }
  }),

  actions: {
    selectUser(ticket, user) {
      this.get('updateResponder').perform(ticket, user);
    }
  }
});
