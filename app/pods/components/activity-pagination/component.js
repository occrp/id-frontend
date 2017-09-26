import Ember from 'ember';
import PaginationMixin from 'id-frontend/mixins/pagination-numbers';

export default Ember.Component.extend(PaginationMixin, {
  tagName: 'nav',
  classNames: ['pg']
});
