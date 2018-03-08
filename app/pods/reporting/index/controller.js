import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import groupByDate from 'id-frontend/pods/reporting/group-by-date';

export default Controller.extend({
  processedStats: computed('model.@each.count', function() {
    let items = this.get('model');

    return groupByDate(items);
  }),

  total: reads('model.meta.total')
});
