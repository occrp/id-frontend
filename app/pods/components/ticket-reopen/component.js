import Ember from 'ember';
import { task } from 'ember-concurrency';
import { Validations } from 'id2-frontend/models/comment';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  isShowingModal: false,

  comment: null,
  didValidate: false,

  publishActivity: task(function * () {
    let record = this.get('store').createRecord('activity', {
      type: 'reopen',
      comment: this.get('comment'),
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
          this.get('publishActivity').perform().then(() => {
            this.set('comment', null);
            this.set('didValidate', false);
            this.set('isShowingModal', false);
            this.get('model').reload();
          });
        }
      });
    }
  }

});
