import Route from '@ember/routing/route';
import LoadingSliderMixin from 'id-frontend/mixins/loading-slider';
import DS from 'ember-data';
import ENV from 'id-frontend/config/environment';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

const { UnauthorizedError } = DS;

export default Route.extend({
  session: service(),
  loadingSlider: service(),

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
    },

    // Taken from LoadingSliderMixin addon
    // Modified to not end transition after beforeModel (above) finishes
    loading(transition, originRoute) {
      let loadingSliderService = this.get('loadingSlider');
      loadingSliderService.startLoading();
      if (isPresent(this.router) && originRoute.routeName !== 'application') {
        this.router.one('didTransition', function() {
          loadingSliderService.endLoading();
        });
      }
      return true;
    },

    finished() {
      this.get('loadingSlider').endLoading();
    }
  }
});
