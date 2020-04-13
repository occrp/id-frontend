import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  flashMessages: service(),

  actions: {
    saveDeadline() {
      const model = this.get('model');

      // TODO: Add validations
      if (model.get('isValid')) {
        model.save();
      }
    }
  }
});
