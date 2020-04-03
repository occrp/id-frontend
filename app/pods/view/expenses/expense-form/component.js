import Component from '@ember/component';

export default Component.extend({
  afterSave: null,
  model: null,

  actions: {
    saveExpense() {
      const afterSave = this.get('afterSave');
      const model = this.get('model');

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
