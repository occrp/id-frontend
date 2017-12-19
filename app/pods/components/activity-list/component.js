import Ember from 'ember';
import { task } from 'ember-concurrency';
import { Validations } from 'id-frontend/models/comment';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),

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

  body: null,
  didValidate: false,

  publishComment: task(function * () {
    let record = this.get('store').createRecord('comment', {
      body: this.get('body'),
      ticket: this.get('model'),
      user: this.get('session.currentUser')
    });
    yield record.save();
  }),

  currentPage: null,
  pageSize: 50,
  activityCache: null,

  loadActivities: task(function * (pageNumber) {
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

    return records;
  }),

  didReceiveAttrs() {
    this.get('loadActivities').perform(1).then((records) => {
      this.set('currentPage', 1);
      this.set('activityCache', records);
    });
  },

  actions: {
    switchPage(pageNumber) {
      this.get('loadActivities').perform(pageNumber).then((records) => {
        this.set('currentPage', pageNumber);
        this.set('activityCache', records);
      });
    },

    save() {
      this.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          this.get('publishComment').perform().then(() => {
            this.set('body', null);
            this.set('didValidate', false);
            this.send('switchPage', 1);
          });
        }
      });
    }
  }

});
