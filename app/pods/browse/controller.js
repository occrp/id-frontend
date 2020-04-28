import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import Pageable from 'id-frontend/mixins/pageable';

export default Controller.extend(Pageable, {
  session: service(),
  flashMessages: service(),

  queryParams: ['status', 'search', 'country', 'kind', 'requester', 'responder', 'sort'],

  status: 'new,in-progress,pending',
  search: null,
  country: null,
  kind: null,
  requester: null,
  responder: null,
  sort: '-created-at',

  csvExportParams: null,

  statusPairs: Object.freeze({
    open: 'new,in-progress,pending',
    closed: 'closed,cancelled'
  }),

  filterMeta: computed('model.meta', function() {
    let meta = this.get('model.meta');
    return meta.filters ? meta.filters : { responder: null, requester: null };
  }),

  total: computed('model.meta', function() {
    let total = this.get('model.meta.total');

    // camelCased because serializers/application
    return total && {
      all: total.all,
      open: total.new + total.inProgress + total.pending,
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

    resetAllFilters() {
      this.setProperties({
        kind: null,
        country: null,
        requester: null,
        responder: null,
        page: 1
      });
    },

    resetFilter(prop) {
      let hash = {
        page: 1
      };
      hash[prop] = null;

      this.setProperties(hash);
    }
  }
});
