import Ember from 'ember';

export default Ember.Component.extend({
  statusByType: {
    'status_closed': 'closed',
    'status_cancelled': 'cancelled'
  }
});
