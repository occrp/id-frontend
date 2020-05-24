import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id-frontend/models/profile';

export const relRemovalGenerator = function * (rel) {
  yield rel.destroyRecord().catch(() => {
    this.get('flashMessages').danger('errors.genericRequest');
  });
};

export default Component.extend({
  store: service(),
  session: service(),
  flashMessages: service(),
  activityBus: service(),

  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  addResponder: task(function * (ticket, user) {
    let record = this.get('store').createRecord('responder', {
      ticket,
      user
    });
    yield record.save().catch(() => {
      record.rollbackAttributes();
      this.get('flashMessages').danger('errors.genericRequest');
    })
  }),

  removeResponder: task(relRemovalGenerator),

  actions: {
    addResponder(user) {
      const ticket = this.get('model');
      this.get('addResponder').perform(ticket, user).then(() => {
        // Reloading the model too since the status will change
        // when adding the first responder
        ticket.reload();
        this.get('activityBus').trigger('reload');
      });
    },

    removeResponder(responder) {
      this.get('removeResponder').perform(responder).then(() => {
        this.get('activityBus').trigger('reload');
      });
    }
  }
});
