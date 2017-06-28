import Ember from 'ember';
import DS from 'ember-data';
import { timeout } from 'ember-concurrency';

const { attr } = DS;

export default DS.Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  email: attr('string'),

  isStaff: attr('boolean'),
  isSuperuser: attr('boolean'),

  displayName: Ember.computed('firstName', 'lastName', function () {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  })
});

export const getSearchGenerator = function({ isStaff }) {
  return function * (term) {
    yield timeout(250);

    let owner = Ember.getOwner(this);
    let store = owner.lookup('service:store');
    let items = yield store.query('profile', { filter: { search: term, 'is-staff': isStaff } });

    return items;
  };
};

