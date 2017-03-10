import Ember from 'ember';
import Pageable from 'id2-frontend/mixins/pageable';

export default Ember.Controller.extend(Pageable, {
  queryParams: ['status', 'type', 'author', 'assignee', 'sort'],

  status: 'open',
  type: null,
  author: null,
  assignee: null,
  sort: '-created',

  actions: {
    updateFilter(key, value) {
      this.set(key, value);
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
