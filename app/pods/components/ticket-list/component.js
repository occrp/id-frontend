import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id2-frontend/models/user';

export default Ember.Component.extend({
  searchStaff: task(getSearchGenerator({isStaff: true})).restartable(),

  updateAssignee: task(function * (model, user) {
    model.set('assignee', user);
    yield model.save();
  }),

  actions: {
    selectUser(model, user) {
      this.get('updateAssignee').perform(model, user);
    }
  }
});
