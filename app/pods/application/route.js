import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import LoadingSliderMixin from 'id-frontend/mixins/loading-slider';

export default Route.extend(LoadingSliderMixin, {
  session: service(),

  beforeModel() {
    return this.get('session').getCurrentSession();
  }
});
