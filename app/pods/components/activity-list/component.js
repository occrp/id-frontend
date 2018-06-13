import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),
  activityBus: service(),

  componentsByType: Object.freeze({
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
  }),

  activityCache: null,
  cursor: null,
  pageSize: 50, // must match the one in /serializers/ticket

  loadItems: task(function * () {
    let filter =  {
      'target_object_id': this.get('model.id')
    };

    if (this.get('cursor')) {
      filter['id__lt'] = this.get('cursor');
    }

    if (this.get('showOnlyComments') === true) {
      filter.verb = 'comment:create';
    }


    yield this.get('store').query('activity', {
      filter,
      page: {
        size: this.get('pageSize')
      },
      sort: 'timestamp',
      include: 'comment,responder-user,user'
    }).then((records) => {
      this.get('activityCache').addObjects(records.toArray());
      this.set('cursor', records.get('firstObject.id'));
    });
  }),

  sortedActivities: computed('activityCache.[]', function() {
    return this.get('activityCache').sortBy('createdAt');
  }),

  init() {
    this._super(...arguments);

    this.set('activityCache', new A());
    this.reloadActivitites();

    this.get('activityBus').on('reload', this, 'reloadActivitites');
  },

  willDestroyElement() {
    this.get('activityBus').off('reload', this, 'reloadActivitites');
  },

  reloadActivitites() {
    this.set('cursor', null);
    this.get('loadItems').perform();
  },

  showOnlyComments: false,

  actions: {
    loadMore() {
      this.get('loadItems').perform();
    },

    changeKind(value) {
      this.set('showOnlyComments', value);
      this.set('activityCache', new A());
      this.reloadActivitites();
    },
  }

});
