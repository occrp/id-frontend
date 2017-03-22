import Ember from 'ember';
import { Ability } from 'ember-can';

export default Ability.extend({
  session: Ember.inject.service(),

  canManage: Ember.computed.reads('session.currentUser.isStaff')
});
