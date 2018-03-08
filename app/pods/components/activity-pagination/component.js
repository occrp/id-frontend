import Component from '@ember/component';
import PaginationMixin from 'id-frontend/mixins/pagination-numbers';

export default Component.extend(PaginationMixin, {
  tagName: 'nav',
  classNames: ['pg']
});
