import Route from '@ember/routing/route';
import LoadingSliderMixin from 'id-frontend/mixins/loading-slider';
import DS from 'ember-data';
import ENV from 'id-frontend/config/environment';
import { inject as service } from '@ember/service';

const { UnauthorizedError } = DS;

export default Route.extend(LoadingSliderMixin, {
  session: service(),

  beforeModel() {
    return this.get('session').getCurrentSession();
  },

  actions: {
    error(error) {
      if (error instanceof UnauthorizedError) {
        window.location.replace(ENV.options.loginURL);
        return;
      }

      return true;
    }
  }
});
