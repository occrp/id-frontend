import Ember from 'ember';
import Pageable from 'id2-frontend/mixins/pageable';

export default Ember.Controller.extend(Pageable, {
  queryParams: ['status', 'kind', 'author', 'assignee', 'sort'],

  status: 'open',
  kind: null,
  author: null,
  assignee: null,
  sort: '-created',

  filterMeta: Ember.computed('model.meta', function () {
    let meta = this.get('model.meta');
    return meta.filters ? meta.filters : { assignee: null, author: null };
  }),

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
        kind: null,
        author: null,
        assignee: null
      });
    }
  }
});
