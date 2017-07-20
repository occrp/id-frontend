import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  body: attr('string'),
  createdAt: attr('date'),

  user: belongsTo('profile'),
  ticket: belongsTo()  
});

export const Validations = buildValidations({
  body: validator('presence', {
    presence: true,
  })
}, {
  debounce: 100,
  messageKey: 'errors.genericInvalid'
});
