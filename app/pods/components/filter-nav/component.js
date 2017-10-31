import Ember from 'ember';
import { task } from 'ember-concurrency';
import { kindList } from 'id-frontend/models/ticket';
import { getSearchGenerator } from 'id-frontend/models/profile';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),

  tagName: '',
  kindList,

  sortFields: Ember.computed('i18n', function() {
    let i18n = this.get('i18n');
    return {
      '-created-at': i18n.t('filters.sort.createdAt.desc'),
      'created-at': i18n.t('filters.sort.createdAt.asc'),
      'deadline-at': i18n.t('filters.sort.deadlineAt.desc'),
      '-deadline-at': i18n.t('filters.sort.deadlineAt.asc')
    }
  }),

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
