import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const { attr, belongsTo } = DS;

export const typeList = [
  'update', // comment
  'close',
  'reopen',
  'join', // assign
  'leave' // unassign
];


export default DS.Model.extend({
  type: attr('string'),
  created: attr('date'),
  comment: attr('string'),

  author: belongsTo('user'),
  ticket: belongsTo(),
});


export const Validations = buildValidations({
  // Person
  comment: validator('presence', {
    presence: true,
  })
}, {
  debounce: 100,
  message: 'Please fill in this field'
});
