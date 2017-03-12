import Ember from 'ember';
import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  email: attr('string'),

  isStaff: attr('boolean'),
  isSuperuser: attr('boolean'),

  displayName: Ember.computed('firstName', 'lastName', function () {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  })
});
