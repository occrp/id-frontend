import Ember from 'ember';
import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import notEqual from '../macros/not-equal';
import raw from 'ember-macro-helpers/raw';

const { attr, belongsTo, hasMany } = DS;

export const typeMap = {
  'person_ownership': {
    name: 'Identify what a person owns',
    shortName: 'Person',
    icon: 'fa-user'
  },
  'company_ownership': {
    name: 'Determine company ownership',
    shortName: 'Company',
    icon: 'fa-building'
  },
  'other': {
    name: 'Any other question',
    shortName: 'Other',
    icon: 'fa-question'
  }
};

export const typeList = Object.keys(typeMap);

export const statusMap = {
  'new': { name: 'New', labelClass: 'tag--new' },
  'in-progress': { name: 'In progress', labelClass: 'tag--progress' },
  'closed': { name: 'Closed', labelClass: 'tag--closed' },
  'cancelled': { name: 'Cancelled', labelClass: 'tag--cancelled' }
};

export const statusList = Object.keys(statusMap);


export default DS.Model.extend({
  // Common
  type: attr('string', { defaultValue: typeList[0] }),
  created: attr('date'),
  status: attr('string', { defaultValue: statusList[0] }),
  statusUpdated: attr('date'),

  sensitive: attr('boolean', { defaultValue: false }),
  whySensitive: attr('string'),
  deadline: attr('date'),

  author: belongsTo('user'),
  assignee: belongsTo('user'),
  activities: hasMany('activity', { async: true }),
  attachments: hasMany('attachment', { async: true }),

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
        return this.get('question').slice(0, 140);
    }
  }),

  isOpen: Ember.computed('status', function() {
    let status = this.get('status');
    return status === statusList[0] || status === statusList[1];
  }),

  isClosed: Ember.computed('status', function() {
    let status = this.get('status');
    return status === statusList[2] || status === statusList[3];
  })

});


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
