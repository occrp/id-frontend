import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { Validations } from 'id-frontend/models/review';

export default Controller.extend({
  Validations,
  flashMessages: service(),
  saved: false,

  saveRecord: task(function * (changeset) {
    yield changeset.save();
  }),

  actions: {
    save: function(changeset) {
      const saveRecord = this.get('saveRecord');
      const self = this;

      changeset.validate().then(function() {
        if (changeset.get('isValid')) {
          saveRecord.perform(changeset).then(function() {
            self.set('saved', true);
          });
        }
      });
    }
  }
});
