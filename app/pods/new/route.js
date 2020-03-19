import Route from '@ember/routing/route';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  redirect() {
    if (isBlank(this.get('session.currentUser.bio'))) {
      this.transitionTo('user');
    }
  },
  model() {
    return this.get('store').createRecord('ticket');
  },
  deactivate() {
    this.currentModel.rollbackAttributes();
  }
});
