import Ember from 'ember';
import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import notEqual from '../macros/not-equal';
import raw from 'ember-macro-helpers/raw';

const { attr, belongsTo, hasMany } = DS;

export const kindList = [
  'person_ownership',
  'company_ownership',
  'other'
];

export const statusList = [
  'new',
  'in-progress',
  'closed',
  'cancelled'
];


export default DS.Model.extend({
  // Common
  kind: attr('string', { defaultValue: kindList[0] }),
  status: attr('string', { defaultValue: statusList[0] }),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  deadlineAt: attr('date'),

  requester: belongsTo('profile'),
  responders: hasMany('responder'),
  activities: hasMany('activity'),
  attachments: hasMany('attachment'), 

  // Common
  background: attr('string'),
  sensitive: attr('boolean', { defaultValue: false }),
  whySensitive: attr('string'),

  // Person
  firstName: attr('string'),
  lastName: attr('string'),
  initialInformation: attr('string'),
  bornAt: attr('date'),
  businessActivities: attr('string'),

  // Company
  companyName: attr('string'),
  country: attr('string'),
  sources: attr('string'), // reused on Person, labeled "Aliases"
  connections: attr('string'), // reused on Person, labeled "Family info"

  
  displayName: Ember.computed('kind', 'firstName', 'lastName', 'companyName', 'background', function () {
    switch (this.get('kind')) {
      case kindList[0]:
        return `${this.get('firstName')} ${this.get('lastName')}`;
      case kindList[1]:
        return this.get('companyName');
      default:
        return this.get('background').slice(0, 140);
    }
  }),

  responderIds: Ember.computed('responders.[]', function () {
    let responders = this.get('responders');
    let userIds = responders.map(resp => resp.belongsTo('user').id())
    return userIds;
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
  background: validator('presence', {
    presence: true,
  }),

  // Person
  firstName: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[0]))
  }),
  lastName: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[0]))
  }),
  initialInformation: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[0]))
  }),

  // Company
  companyName: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[1]))
  }),
  country: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[1]))
  }),
  sources: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[1]))
  })
}, {
  debounce: 100,
  messageKey: 'errors.genericInvalid'
});
