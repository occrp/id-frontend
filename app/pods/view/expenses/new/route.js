import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),

  model() {
    const ticket = this.modelFor('view');
    const user = this.get('session.currentUser');
    return this.get('store').createRecord('expense', { ticket, user });
  },

  deactivate() {
    this.currentModel.rollbackAttributes();
  }
});
