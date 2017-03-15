import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  ajax: Ember.inject.service(),

  currentUser: null,

  getCurrentSession: function() {
    let adapter = Ember.getOwner(this).lookup('adapter:application');
    let url = adapter.get('namespace') + '/me';
    let store = this.get('store');

    let promise = this.get('ajax').request(url).then((payload) => {
      let user = store.push({
        data: {
          id: payload.id,
          type: 'user',
          attributes: {
            firstName: payload.first_name,
            lastName: payload.last_name,
            email: payload.email,
            isStaff: payload.is_staff,
            isSuperuser: payload.is_superuser
          }
        }
      });
      this.set('currentUser', user);
    });

    return promise;
  }

});
