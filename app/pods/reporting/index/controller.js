import Ember from 'ember';
import groupByDate from 'id-frontend/pods/reporting/group-by-date';

const { computed } = Ember;

export default Ember.Controller.extend({
  processedStats: computed('model.@each.count', function() {
    let items = this.get('model');

    return groupByDate(items);
  }),

  total: Ember.computed.reads('model.meta.total')
});
