import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  activityBus: service(),
  flashMessages: service(),

  updateStatus: task(function * (newStatus, comment) {
    let model = this.get('model');

    model.set('status', newStatus);

    if (comment) {
      const attr = newStatus === 'pending' ? 'pendingReason' : 'reopenReason';
      model.set(attr, comment);
    }

    yield model.save();
  }),

  actions: {
    saveStatus(activityType, comment) {
      const mapToStatus = {
        'close': 'closed',
        'cancel': 'cancelled',
        'reopen': 'in-progress',
        'unmark': 'in-progress',
        'pending': 'pending'
      };
      this.get('updateStatus').perform(mapToStatus[activityType], comment).then(() => {
        this.get('activityBus').trigger('reload');
      }, () => {
        this.get('model').rollbackAttributes();
        this.get('flashMessages').danger('errors.genericRequest');
      });
    }
  }
});
