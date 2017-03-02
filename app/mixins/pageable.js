import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['page', 'size'],

  page: 1,
  size: 25
});
