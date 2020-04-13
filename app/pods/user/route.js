import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  queryParams: {
    resumeSubmission: {}
  },

  session: service(),

  actions: {
    save: function(params, queryParams) {
      this.currentModel.save().then(()=> {
        if (this.get('resumeSubmission')) {
          this.transitionTo('new');
        }
      });
    }
  },

  model(params) {
    this.set('resumeSubmission', params.resumeSubmission);
    return this.get('session.currentUser');
  },

  deactivate() {
    this.currentModel.rollbackAttributes();
  }
});
