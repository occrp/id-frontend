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
    const firstName = this.get('firstName');
    const lastName = this.get('lastName');

    if (!firstName && !lastName) {
      return this.get('email');
    }

    return `${firstName} ${lastName}`.trim();
  })
});

export const getSearchGenerator = function({ isStaff }) {
  return function * (term) {
    yield timeout(250);

    let owner = Ember.getOwner(this);
    let store = owner.lookup('service:store');
    let items = yield store.query('profile', { filter: { name: term, 'is-staff': isStaff } });

    return items;
  };
};

