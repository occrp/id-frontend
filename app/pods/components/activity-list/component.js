import Ember from 'ember';
import { task } from 'ember-concurrency';
import { Validations } from 'id2-frontend/models/comment';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  componentsByType: {
    'comment': 'activity-comment',
    'status_closed': 'activity-close',
    'status_cancelled': 'activity-close',
    'status_new': 'activity-reopen',
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
