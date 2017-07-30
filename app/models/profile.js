import Ember from 'ember';
import DS from 'ember-data';
import { timeout } from 'ember-concurrency';
import ProfileDecorator from 'id2-frontend/mixins/profile-decorator';

const { attr } = DS;

export default DS.Model.extend(ProfileDecorator, {
  firstName: attr('string'),
  lastName: attr('string'),
  email: attr('string'),

  isStaff: attr('boolean'),
  isSuperuser: attr('boolean'),
});

export const getSearchGenerator = function({ isStaff }) {
  return function * (term) {
    yield timeout(250);

    let owner = Ember.getOwner(this);
    let store = owner.lookup('service:store');
    let items = yield store.query('profile', {
      filter: {
        name: term,
        'is-staff': isStaff
      },
      page: {
        number: 1,
        size: 6
      },
    });

    return items;
  };
};

