import Ember from 'ember';
import Pageable from 'id2-frontend/mixins/pageable';

export default Ember.Controller.extend(Pageable, {
  queryParams: ['status', 'type', 'author', 'assignee', 'sort'],

  status: 'open',
  type: null,
  author: null,
  assignee: null,
  sort: '-created',

  filterMeta: Ember.computed.reads('model.meta.filters'),

  actions: {
    updateFilter(key, value, meta) {
      let hash = {};

      hash[key] = value;

      // We're updating filterMeta's key eagerly so that the active filter UI
      // updates immediately, instead of waiting for the model to reload &
      // break filterMeta's CP cache.
      if (meta) {
        hash[`filterMeta.${key}`] = meta;
      }

      this.setProperties(hash);
      this.set('page', 1);
    },

    resetFilters() {
      this.setProperties({
        type: null,
        author: null,
        assignee: null
      })
    }
  }
});
