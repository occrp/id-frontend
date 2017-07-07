import Ember from 'ember';
import Pageable from 'id2-frontend/mixins/pageable';

export default Ember.Controller.extend(Pageable, {
  queryParams: ['status', 'kind', 'requester', 'responder', 'sort'],

  status: ['new','in-progress'],
  kind: null,
  requester: null,
  responder: null,
  sort: '-created-at',

  statusPairs: {
    open: ['new','in-progress'],
    closed: ['closed','cancelled']
  },

  filterMeta: Ember.computed('model.meta', function () {
    let meta = this.get('model.meta');
    return meta.filters ? meta.filters : { responder: null, requester: null };
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
        requester: null,
        responder: null
      });
    }
  }
});
