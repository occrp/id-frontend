import Ember from 'ember';
import { task } from 'ember-concurrency';
import { typeMap } from 'id2-frontend/models/ticket';
import { getSearchGenerator } from 'id2-frontend/models/user';

export default Ember.Component.extend({
  typeMap,

  sortFields: {
    '-created': 'Newest',
    'created': 'Oldest',
    'deadline': 'Closest deadline',
    '-deadline': 'Furthest deadline'
  },

  searchAuthors: task(getSearchGenerator({ isStaff: false })).restartable(),
  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  actions: {
    applyAuthor(user) {
      this.get('updateFilter')('author', user.get('id'), {
        firstName: user.get('firstName'),
        lastName: user.get('lastName')
      });
    },

    applyAssignee(user) {
      if (user === 'none') {
        this.get('updateFilter')('assignee', 'none');
      } else {
        this.get('updateFilter')('assignee', user.get('id'), {
          firstName: user.get('firstName'),
          lastName: user.get('lastName')
        });
      }
    }
  }

});
