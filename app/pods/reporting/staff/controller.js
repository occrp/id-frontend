import Controller from '@ember/controller';
import { taskGroup } from 'ember-concurrency';

export default Controller.extend({
  statsTaskGroup: taskGroup(),
});
