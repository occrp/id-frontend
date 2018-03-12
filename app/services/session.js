import { getOwner } from '@ember/application';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  currentUser: null,

  getCurrentSession: function() {

    return this.get('store').queryRecord('profile', { me: true }).then((payload) => {
      this.set('currentUser', payload);
    });
  }

});
