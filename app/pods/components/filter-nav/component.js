import jQuery from 'jquery'
import moment from 'moment';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { kindList } from 'id-frontend/models/ticket';
import { getSearchGenerator } from 'id-frontend/models/profile';

export default Component.extend({
  intl: service(),

  tagName: '',
  kindList,
  csvExportParams: null,

  csvExportTicketsUrl: computed('csvExportParams', function() {
    const adapter = getOwner(this).lookup('adapter:application');
    const qParams = jQuery.param(this.get('csvExportParams'));

    return adapter.urlForQuery({}, 'ticket-exports') + '?' + qParams;
  }),

  csvExportExpensesUrl: computed('csvExportParams', function() {
    const adapter = getOwner(this).lookup('adapter:application');
    const qParams = jQuery.param(this.get('csvExportParams'));

    return adapter.urlForQuery({}, 'expense-exports') + '?' + qParams;
  }),

  sortFields: computed('intl.locale', function() {
    let intl = this.get('intl');
    return {
      '-created-at': intl.t('filters.sort.createdAt.desc'),
      'created-at': intl.t('filters.sort.createdAt.asc'),
      'deadline-at': intl.t('filters.sort.deadlineAt.desc'),
      '-deadline-at': intl.t('filters.sort.deadlineAt.asc')
    }
  }),

  searchRequesters: task(getSearchGenerator()).restartable(),
  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  actions: {
    applyStartDate(newStartDate) {
      if (newStartDate) {
        this.get('updateFilter')(
          'startDate',
          moment(newStartDate).toISOString().slice(0, -5)
        );
      }
    },

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
