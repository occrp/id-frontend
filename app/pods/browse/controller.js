import Ember from 'ember';
import Pageable from 'id2-frontend/mixins/pageable';

export default Ember.Controller.extend(Pageable, {
  queryParams: ['status'],

  status: 'open'
});
