import DS from 'ember-data';
import Ember from "ember";

const { underscore } = Ember.String;

export default DS.JSONAPIAdapter.extend({
  namespace: 'api/v3',
  
  // underscore sort values, keep the order dash prefix
  urlForQuery (query) {
    if (query.sort) {
      const orderDashIndex = query.sort.indexOf('-');
      const splitIndex = orderDashIndex === 0 ? 1 : 0;
      const prefix = orderDashIndex === 0 ? '-' : '';
      const processed = underscore(query.sort.substring(splitIndex));

      query.sort = prefix + processed;
    }

    return this._super(...arguments);
  }
});
