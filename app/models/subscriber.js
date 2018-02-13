import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  createdAt: attr('date'),
  updatedAt: attr('date'),
  userEmail: attr('string'),

  ticket: belongsTo(),
  user: belongsTo('profile')
});

export const Validations = buildValidations({
  userEmail: validator('format', {
    type: 'email'
  })
}, {
  debounce: 500
});
