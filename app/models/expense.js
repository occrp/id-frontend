import DS from 'ember-data';
import { validatePresence } from 'ember-changeset-validations/validators';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  scope: attr('string'),
  amount: attr('number'),
  amountCurrency: attr('string', { defaultValue: 'USD' }),
  rating: attr('number', { defaultValue: 0 }),
  notes: attr('string'),
  paymentMethod: attr('string'),
  createdAt: attr('date', { defaultValue() { return new Date(); } }),
  updatedAt: attr('date'),

  user: belongsTo('profile'),
  ticket: belongsTo()
});

export const Validations = {
  scope: [
    validatePresence(true)
  ]
};
