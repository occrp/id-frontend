import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: ['page', 'size'],

  page: 1,
  size: 25
});
