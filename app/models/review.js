import DS from 'ember-data';
import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  rating: attr('number', { defaultValue: 0 }),
  link: attr('string'),
  body: attr('string'),
  createdAt: attr('date'),

  token: attr('string'),

  ticket: belongsTo()
});

export const Validations = {
  rating: [
    validatePresence(true),
    validateNumber({ integer: true, lte: 1, gte: -1 })
  ]
};
