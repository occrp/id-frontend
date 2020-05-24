import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id-frontend/models/profile';

export default Component.extend({
  store: service(),
  flashMessages: service(),
  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  updateResponder: task(function * (ticket, user) {
    let record = this.get('store').createRecord('responder', {
      ticket,
      user
    });

    yield record.save().catch(() => {
      record.rollbackAttributes();
      this.get('flashMessages').danger('errors.genericRequest');
    })
  }),

  actions: {
    selectUser(ticket, user) {
      this.get('updateResponder').perform(ticket, user).then(() => {
        if (ticket.get('status') === 'new') {
          ticket.reload();
        }
      });
    }
  }
});
