import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { priorityList } from 'id-frontend/models/ticket';

export default Component.extend({
  priorityList,
  flashMessages: service(),

  actions: {
    savePriority() {
      const model = this.get('model');

      if (model.get('isValid')) {
        model.save().catch(() => {
          this.get('flashMessages').danger('errors.genericRequest');
        });
      }
    }
  }
});
