import Route from '@ember/routing/route';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import { kindList } from 'id-frontend/models/ticket';

export default Route.extend({
  session: service(),

  beforeModel() {
    let result = this._super(...arguments);

    if (isBlank(this.get('session.currentUser.bio'))) {
      this.transitionTo('user', { queryParams: { resumeSubmission: true } });
    }

    return result;
  },

  model() {
    return this.get('store').createRecord('ticket', { kind: kindList[1] });
  },

  deactivate() {
    this.currentModel.rollbackAttributes();
  }
});
