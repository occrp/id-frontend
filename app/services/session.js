import { getOwner } from '@ember/application';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),
  ajax: service(),

  currentUser: null,

  getCurrentSession: function() {
    let adapter = getOwner(this).lookup('adapter:application');
    let url = adapter.get('namespace') + '/me';
    let store = this.get('store');

    let promise = this.get('ajax').request(url).then((payload) => {
      let user = store.push({
        data: {
          id: payload.id,
          type: 'profile',
          attributes: {
            firstName: payload.first_name,
            lastName: payload.last_name,
            email: payload.email,
            isStaff: payload.is_staff,
            isSuperuser: payload.is_superuser,
            ticketsCount: payload.tickets_count
          }
        }
      });
      this.set('currentUser', user);
    });

    return promise;
  }

});
