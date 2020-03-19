import Route from '@ember/routing/route';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  actions: {
    save: function() {
      this.currentModel.save();
    }
  },

  model() {
    return this.get('session.currentUser');
  },
  deactivate() {
    this.currentModel.rollbackAttributes();
  }
});
