import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  componentsByType: {
    'comment:create': 'comment',
    'ticket:update:status_closed': 'close',
    'ticket:update:status_cancelled': 'cancel',
    'ticket:update:pending': 'pending',
    'ticket:update:status_in-progress': 'resume',
    'ticket:update:reopen': 'reopen',
    'attachment:create': 'attachment',
    'attachment:destroy': 'attachment-deleted',
    'responder:create': 'assign',
    'responder:destroy': 'unassign'
  },

  loadItems: task(function * (pageNumber) {
    let records = yield this.get('store').query('activity', {
      filter: {
        'target_object_id': this.get('id')
      },
      page: {
        number: pageNumber,
        size: this.get('pageSize')
      },
      sort: 'timestamp',
      include: 'comment,responder-user,user'
    });

    return records;
  }),

  currentPage: null,
  pageSize: 40, // must match the one in /serializers/ticket
  activityCache: null,

  // cache the initial load and any other outside reloads via DS.references
  didUpdateAttrs() {
    this.set('currentPage', 1);
    this.set('activityCache', this.get('items'));
  },

  actions: {
    switchPage(pageNumber) {
      this.get('loadItems').perform(pageNumber).then((records) => {
        this.set('currentPage', pageNumber);
        this.set('activityCache', records);
      });
    }
  }

});
