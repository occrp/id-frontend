import Ember from 'ember';

export default Ember.Component.extend({
  firstItem: Ember.computed('data.[]', function () {
    return this.get('data').get('firstObject');
  })
});
