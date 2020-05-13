import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { Ability } from 'ember-can';

export default Ability.extend({
  session: service(),

  canManage: reads('session.currentUser.isSuperuser'),
  canResolve: reads('session.currentUser.isStaff')
});
