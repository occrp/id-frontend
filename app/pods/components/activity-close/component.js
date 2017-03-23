import Ember from 'ember';

export default Ember.Component.extend({
  statusByType: {
    'close': 'closed',
    'cancel': 'cancelled'
  }
});
