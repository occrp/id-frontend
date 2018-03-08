import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  activityBus: service(),

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
        'target_object_id': this.get('model.id')
      },
      page: {
        number: pageNumber,
        size: this.get('pageSize')
      },
      sort: 'timestamp',
      include: 'comment,responder-user,user'
    });

    this.set('activityCache', records);
    this.set('currentPage', pageNumber);
  }),

  currentPage: null,
  pageSize: 50, // must match the one in /serializers/ticket

  activityCache: null,

  reloadActivitites() {
    this.get('loadItems').perform(1);
  },

  init() {
    this._super(...arguments);

    this.reloadActivitites();
    this.get('activityBus').on('reload', this, 'reloadActivitites');
  },

  willDestroyElement() {
    this.get('activityBus').off('reload', this, 'reloadActivitites');
  },

  actions: {
    switchPage(pageNumber) {
      this.get('loadItems').perform(pageNumber);
    }
  }

});
