import DS from 'ember-data';
import { validatePresence } from 'ember-changeset-validations/validators';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  body: attr('string'),
  createdAt: attr('date'),

  user: belongsTo('profile'),
  ticket: belongsTo()
});

export const Validations = {
  body: [
    validatePresence(true)
  ]
};
