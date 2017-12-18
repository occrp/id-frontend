import Ember from 'ember';
import { taskGroup } from 'ember-concurrency';

export default Ember.Controller.extend({
  countriesTaskGroup: taskGroup(),
});
