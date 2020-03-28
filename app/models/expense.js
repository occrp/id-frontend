import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  scope: attr('string'),
  amount: attr('number'),
  amountCurrency: attr('string', { defaultValue: 'USD' }),
  rating: attr('number'),
  notes: attr('string'),
  paymentMethod: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),

  user: belongsTo('profile'),
  ticket: belongsTo()
});

export const Validations = buildValidations({
  scope: validator('presence', {
    presence: true,
  })
}, {
  debounce: 100,
  messageKey: 'validationErrors.blank'
});
