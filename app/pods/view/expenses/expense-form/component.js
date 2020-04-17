import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),

  afterSave: null,
  model: null,

  actions: {
    saveExpense() {
      const afterSave = this.get('afterSave');
      const model = this.get('model');

      if (!model.get('createdAt')) {
        model.set('createdAt', new Date);
      }

      model.save().then(function() { afterSave(model) });
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
