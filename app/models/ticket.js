import Ember from 'ember';
import DS from 'ember-data';

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
  aliases: attr('string'),
  dob: attr('date'),
  family: attr('string'),
  background: attr('string'),
  businessActivities: attr('string'),
  initialInformation: attr('string'),

  // Company
  companyName: attr('string'),
  country: attr('string'),
  companyBackground: attr('string'),
  connections: attr('string'),
  sources: attr('string'),

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
