import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { Validations } from 'id-frontend/models/comment';

export default Component.extend({
  Validations,

  store: service(),
  session: service(),
  activityBus: service(),

  init() {
    this.set('record', this.buildComment());
    this._super(arguments);
  },

  buildComment() {
    return this.get('store').createRecord('comment', {
      ticket: this.get('model'),
      user: this.get('session.currentUser')
    });
  },

  publishComment: task(function * (changeset) {
    yield changeset.save();
  }),

  actions: {
    save(changeset) {
      const publishComment = this.get('publishComment');

      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          publishComment.perform(changeset).then(() => {
            this.set('record', this.buildComment());
            this.get('activityBus').trigger('reload');
          });
        }
      });
    }
  }

});
