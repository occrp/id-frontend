import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id-frontend/models/profile';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  updateResponder: task(function * (ticket, user) {
    let record = this.get('store').createRecord('responder', {
      ticket,
      user
    });

    try {
      yield record.save();
    } catch (e) {
      record.rollbackAttributes();
      this.get('flashMessages').danger('errors.genericRequest');
    }
  }),

  actions: {
    selectUser(ticket, user) {
      this.get('updateResponder').perform(ticket, user).then(() => {
        if (ticket.get('status') === 'new') {
          ticket.reload();
        }
      });
    }
  }
});
