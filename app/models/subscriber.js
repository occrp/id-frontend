import DS from 'ember-data';
import { computed } from '@ember/object';
import { validateFormat } from 'ember-changeset-validations/validators';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  createdAt: attr('date'),
  updatedAt: attr('date'),
  email: attr('string'),

  ticket: belongsTo(),
  user: belongsTo('profile'),

  displayName: computed('user.id', function() {
    if (!this.get('user.id')) {
      return this.get('email');
    }

    return this.get('user.displayName');
  })
});

export const Validations = {
  email: [
    validateFormat({ type: 'email' })
  ]
}
