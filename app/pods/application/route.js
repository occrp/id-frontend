import Ember from 'ember';
import LoadingSliderMixin from 'id-frontend/mixins/loading-slider';

export default Ember.Route.extend(LoadingSliderMixin, {
  session: Ember.inject.service(),

  beforeModel() {
    return this.get('session').getCurrentSession();
  }
});
