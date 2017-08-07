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
    'ticket:update:reopen': 'reopen',
    'attachment:create': 'attachment',
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

  actions: {
    save() {
      this.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          this.get('publishComment').perform().then(() => {
            this.set('body', null);
            this.set('didValidate', false);
            this.get('model').hasMany('activities').reload();
          });
        }
      });
    }
  }

});
