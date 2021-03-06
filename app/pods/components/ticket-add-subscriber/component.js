import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { Validations } from 'id-frontend/models/subscriber';
import { task } from 'ember-concurrency';

export default Component.extend({
  Validations,

  tagName: '',
  store: service(),
  flashMessages: service(),

  init() {
    this.set('record', this.get('store').createRecord('subscriber'));
    this._super(arguments);
  },

  addSubscriber: task(function * (changeset) {
    changeset.set('ticket', this.get('ticket'));

    yield changeset.save().catch(() => {
      changeset.rollback();
      this.get('flashMessages').danger('errors.genericRequest');
    })
  }),

  actions: {
    save(changeset) {
      const addSubscriber = this.get('addSubscriber');
      const afterAddSubscriber = this.get('afterAddSubscriber');

      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          addSubscriber.perform(changeset).then(() => {
            this.set('record', this.get('store').createRecord('subscriber'));
            afterAddSubscriber();
          });
        }
      });
    }
  }
});
