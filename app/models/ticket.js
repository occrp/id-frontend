import { not, equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data';
import {
  validateDate,
  validatePresence
} from 'ember-changeset-validations/validators';
import { inject as service } from '@ember/service';

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
  'scrape',
  'manipulation',
  'dunno'
];

export default DS.Model.extend({
  intl: service(),

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
  expenses: hasMany('expense'),

  // Common
  background: attr('string'),
  sensitive: attr('boolean', { defaultValue: false }),
  whysensitive: attr('string'),
  memberCenter: attr('string'),
  identifier: attr('string'),
  countries: attr({ defaultValue: function() { return Array(); } }),
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


  displayName: computed('kind', 'firstName', 'lastName', 'companyName', 'identifier', function() {
    switch (this.get('kind')) {
      case kindList[0]:
        return `${this.get('firstName')} ${this.get('lastName')}`;
      case kindList[1]:
        return this.get('companyName');
      case kindList[2]:
        return this.get('identifier');
      case kindList[3]:
        return this.get('intl').t(
          'ticket.dataCategory.' + this.get('initialInformation')
        );
      default:
        return this.get('intl').t('ticket.one');
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


export const OtherValidations = {
  background: [
    validatePresence(true)
  ],
  memberCenter: [
    validatePresence(true)
  ],
  deadlineAt: [
    validateDate({
      allowBlank: true,
      format: 'DD/MM/YYYY',
      after: new Date(),
    })
  ]
};

export const PersonValidations = Object.assign({}, OtherValidations, {
  firstName: [
    validatePresence(true)
  ],
  lastName: [
    validatePresence(true)
  ],
  initialInformation: [
    validatePresence(true)
  ]
});

export const CompanyValidations = Object.assign({}, OtherValidations, {
  country: [
    validatePresence(true)
  ],
  companyName: [
    validatePresence(true)
  ],
  sources: [
    validatePresence(true)
  ]
});

export const VehicleValidations = Object.assign({}, OtherValidations, {
  country: [
    validatePresence(true)
  ],
  identifier: [
    validatePresence(true)
  ]
});

export const DataValidations = Object.assign({}, OtherValidations, {
  initialInformation: [
    validatePresence(true)
  ]
});
