import Ember from 'ember';
import { task } from 'ember-concurrency';
import { kindList } from 'id-frontend/models/ticket';
import { getSearchGenerator } from 'id-frontend/models/profile';

export default Ember.Component.extend({
  tagName: '',
  kindList,

  sortFields: {
    '-created-at': 'Newest',
    'created-at': 'Oldest',
    'deadline-at': 'Closest deadline',
    '-deadline-at': 'Furthest deadline'
  },

  searchRequesters: task(getSearchGenerator()).restartable(),
  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  actions: {
    applyRequester(user) {
      this.get('updateFilter')('requester', user.get('id'), {
        firstName: user.get('firstName'),
        lastName: user.get('lastName')
      });
    },

    applyResponder(user) {
      if (user === 'none') {
        this.get('updateFilter')('responder', 'none');
      } else {
        this.get('updateFilter')('responder', user.get('id'), {
          firstName: user.get('firstName'),
          lastName: user.get('lastName')
        });
      }
    }
  }

});
