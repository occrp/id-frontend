import Ember from 'ember';
import DS from 'ember-data';
import { timeout } from 'ember-concurrency';
import ProfileDecorator from 'id-frontend/mixins/profile-decorator';

const { attr } = DS;

export default DS.Model.extend(ProfileDecorator, {
  firstName: attr('string'),
  lastName: attr('string'),
  email: attr('string'),

  isStaff: attr('boolean'),
  isSuperuser: attr('boolean'),

  ticketCount: attr('number')
});

export const getSearchGenerator = function(opts) {
  return function * (term) {
    yield timeout(250);

    let flags = {};

    if (opts) {
      flags = {
        'is-staff': opts.isStaff,
        'is-superuser': opts.isSuperuser
      };
    }

    let params = {
      filter: {
        name: term
      },
      page: {
        number: 1,
        size: 6
      }
    };

    Object.assign(params.filter, flags);

    const owner = Ember.getOwner(this);
    const store = owner.lookup('service:store');

    return yield store.query('profile', params);
  };
};

