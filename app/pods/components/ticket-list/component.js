import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id2-frontend/models/user';

export default Ember.Component.extend({
  searchStaff: task(getSearchGenerator({isStaff: true})).restartable(),

  updateResponder: task(function * (model, user) {
    model.set('responder', user);
    yield model.save();
  }),

  actions: {
    selectUser(model, user) {
      this.get('updateResponder').perform(model, user);
    }
  }
});
