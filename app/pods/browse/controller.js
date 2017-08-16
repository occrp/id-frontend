import Ember from 'ember';
import Pageable from 'id-frontend/mixins/pageable';

export default Ember.Controller.extend(Pageable, {
  queryParams: ['status', 'country', 'kind', 'requester', 'responder', 'sort'],

  status: 'new,in-progress',
  country: null,
  kind: null,
  requester: null,
  responder: null,
  sort: '-created-at',

  statusPairs: {
    open: 'new,in-progress',
    closed: 'closed,cancelled'
  },

  filterMeta: Ember.computed('model.meta', function () {
    let meta = this.get('model.meta');
    return meta.filters ? meta.filters : { responder: null, requester: null };
  }),

  total: Ember.computed('model.meta', function () {
    let total = this.get('model.meta.total');

    // camelCased because serializers/application
    return total && {
      all: total.new + total.inProgress + total.closed + total.cancelled,
      open: total.new + total.inProgress,
      closed: total.closed + total.cancelled
    };
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
        country: null,
        requester: null,
        responder: null
      });
    }
  }
});
