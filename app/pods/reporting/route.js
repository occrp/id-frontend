import Ember from 'ember';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(CanMixin, {
  beforeModel() {
    let result = this._super(...arguments);

    if (!this.can('manage tickets')) {
      return this.transitionTo('index');
    }

    return result;
  },

  model(params) {
    return this.get('store').query('ticket-stats', {});
  }
});
