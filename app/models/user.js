import Ember from 'ember';
import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),

  displayName: Ember.computed('firstName', 'lastName', function () {
    return `${firstName} ${lastName}`;
  })
});
