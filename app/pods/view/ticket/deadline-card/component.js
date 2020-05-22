import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { OtherValidations } from 'id-frontend/models/ticket';

export default Component.extend({
  OtherValidations,
  flashMessages: service(),

  actions: {
    saveDeadline(changeset) {
      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          changeset.save().catch(() => {
            this.get('flashMessages').danger('errors.genericRequest');
          });
        }
      });
    }
  }
});
