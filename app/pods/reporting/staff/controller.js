import Ember from 'ember';
import { taskGroup } from 'ember-concurrency';

export default Ember.Controller.extend({
  statsTaskGroup: taskGroup(),
});
