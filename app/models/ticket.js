import { isEmpty } from '@ember/utils';
import { not, equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import notEqual from '../macros/not-equal';
import raw from 'ember-macro-helpers/raw';
import moment from 'moment';

const { attr, belongsTo, hasMany } = DS;

export const kindList = [
  'person_ownership',
  'company_ownership',
  'vehicle_tracking',
  'data_request',
  'other'
];

export const statusList = [
  'new',
  'in-progress',
  'pending',
  'closed',
  'cancelled'
];

export const priorityList = [
  'low',
  'default',
  'high'
];

export const dataRequestTypes = [
  'analysis',
  'aleph',
  'scrape',
  'manipulation',
  'dunno'
];

export default DS.Model.extend({
  // Common
  kind: attr('string', { defaultValue: kindList[0] }),
  status: attr('string', { defaultValue: statusList[0] }),
  priority: attr('string', { defaultValue: priorityList[1] }),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  deadlineAt: attr('date'),
  reopenReason: attr('string'),
  pendingReason: attr('string'),

  requester: belongsTo('profile'),
  responders: hasMany('responder'),
  subscribers: hasMany('subscriber'),
  activities: hasMany('activity'),
  attachments: hasMany('attachment'),

  // Common
  background: attr('string'),
  sensitive: attr('boolean', { defaultValue: false }),
  whysensitive: attr('string'),
  memberCenter: attr('string'),
  identifier: attr('string'),
  countries: attr(),
  tags: attr(),

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


  displayName: computed('kind', 'firstName', 'lastName', 'companyName', 'background', function() {
    switch (this.get('kind')) {
      case kindList[0]:
        return `${this.get('firstName')} ${this.get('lastName')}`;
      case kindList[1]:
        return this.get('companyName');
      default:
        return this.get('background').slice(0, 140);
    }
  }),

  responderIds: computed('responders.[]', function() {
    let responders = this.get('responders');
    let userIds = responders.map(resp => resp.belongsTo('user').id())
    return userIds;
  }),

  isOpen: computed('status', function() {
    return ['closed', 'cancelled'].indexOf(this.get('status')) === -1;
  }),

  isClosed: not('isOpen'),

  isPending: equal('status', 'pending')
});


export const Validations = buildValidations({
  background: [
    validator('presence', {
      presence: true,
    })
  ],

  memberCenter: [
    validator('presence', {
      presence: true,
    })
  ],

  country: validator('presence', {
    presence: true,
    disabled: computed('model.kind', function() {
      return this.get('model.kind') !== kindList[1] &&
        this.get('model.kind') !== kindList[2]
    })
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
  initialInformation: [
    validator('presence', {
      presence: true,
      disabled: computed('model.kind', function() {
        return this.get('model.kind') != kindList[0] &&
          this.get('model.kind') != kindList[3]
      })
    })
  ],

  // Company
  companyName: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[1]))
  }),
  sources: [
    validator('presence', {
      presence: true,
      disabled: notEqual('model.kind', raw(kindList[1]))
    })
  ],

  // Vehicle
  identifier: validator('presence', {
    presence: true,
    disabled: notEqual('model.kind', raw(kindList[2]))
  }),

  deadlineAt: validator('date', {
    value(model, attribute) {
      const val = model.get(attribute);
      if (isEmpty(val)) {
        return val;
      }
      return moment.utc(val).format('DD/MM/YYYY');
    },
    allowBlank: true,
    format: 'DD/MM/YYYY',
    after: computed(function() {
      return moment.utc().format('DD/MM/YYYY');
    }).volatile()
  })
}, {
  debounce: 100
});
