import Ember from 'ember';
import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import notEqual from '../macros/not-equal';
import raw from 'ember-macro-helpers/raw';

const { attr } = DS;

export const typeList = [
  'person_ownership',
  'company_ownership',
  'other'
];

export const statusList = [
  'new',
  'in-prgoress',
  'closed',
  'cancelled'
];

export const Validations = buildValidations({
  // Person
  name: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[0]))
  }),
  surname: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[0]))
  }),
  background: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[0]))
  }),
  initialInformation: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[0]))
  }),

  // Company
  companyName: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[1]))
  }),
  country: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[1]))
  }),
  companyBackground: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[1]))
  }),
  sources: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[1]))
  }),

  // Other
  question: validator('presence', {
    presence: true,
    disabled: notEqual('model.type', raw(typeList[2]))
  })
}, {
  debounce: 100,
  message: 'Please fill in this field'
});

export default DS.Model.extend({
  // Common
  type: attr('string', { defaultValue: typeList[0] }),
  created: attr('date'),
  status: attr('string', { defaultValue: statusList[0] }),
  statusUpdated: attr('date'),

  sensitive: attr('boolean', { defaultValue: false }),
  whySensitive: attr('string'),
  deadline: attr('date'),

  // Do we need to keep these in the UI? only for admins?
  findingsVisible: attr('boolean'),
  isForProfit: attr('boolean'),
  isPublic: attr('boolean'),
  userPays: attr('boolean'),

  // Person
  name: attr('string'),
  surname: attr('string'),
  background: attr('string'),
  initialInformation: attr('string'),
  dob: attr('date'),
  aliases: attr('string'),
  family: attr('string'),
  businessActivities: attr('string'),

  // Company
  companyName: attr('string'),
  country: attr('string'),
  companyBackground: attr('string'),
  sources: attr('string'),
  connections: attr('string'),

  // Other
  question: attr('string'),

  displayName: Ember.computed('type', 'name', 'companyName', 'question', function () {
    switch (this.get('type')) {
      case typeList[0]:
        return `${this.get('name')} ${this.get('surname')}`;
      case typeList[1]:
        return this.get('companyName');
      default:
        return this.get('question').slice(0, 40);
    }
  })
});
