import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { Validations } from 'id-frontend/models/expense';

export default Component.extend({
  Validations,
  session: service(),

  afterSave: null,
  model: null,

  actions: {
    saveExpense(changeset) {
      const afterSave = this.get('afterSave');
      const model = this.get('model');

      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          changeset.save().then(()=> { afterSave(model) });
        }
      });
    },

    deleteExpense() {
      const afterDelete = this.get('afterDelete');
      const model = this.get('model');
      const ticket = this.get('model.ticket');

      model.destroyRecord().then(function() {
        afterDelete(ticket);
      });
    }
  }
});
