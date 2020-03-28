import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { kindList, Validations } from 'id-frontend/models/ticket';
import moment from 'moment';

export default Controller.extend({
  kindList,
  Validations,
  i18n: service(),
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

  minimumDeadline: moment.utc(),
  center: computed('model.deadlineAt', 'minimumDeadline', function() {
    const deadline = this.get('model.deadlineAt');
    if (isBlank(deadline)) {
      return this.get('minimumDeadline');
    }

    return deadline;
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
