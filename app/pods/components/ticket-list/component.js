import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id2-frontend/models/profile';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  updateResponder: task(function * (model, user) {
    let record = this.get('store').createRecord('responder', {
      ticket: model,
      user: user
    });
    yield record.save();
  }),

  actions: {
    selectUser(model, user) {
      this.get('updateResponder').perform(model, user);
    }
  }
});
