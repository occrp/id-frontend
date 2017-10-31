import Ember from 'ember';
import { task } from 'ember-concurrency';
import { kindList, Validations } from 'id-frontend/models/ticket';
import moment from 'moment';

export default Ember.Controller.extend({
  kindList,
  Validations,
  i18n: Ember.inject.service(),

  title: Ember.computed('model.kind', 'i18n.locale', function () {
    let i18n = this.get('i18n');

    switch (this.get('model.kind')) {
      case kindList[2]:
        return i18n.t('ticket.one');
      default:
        return this.get('model.displayName');
    }
  }),

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
  center: Ember.computed('model.deadlineAt', 'minimumDeadline', function() {
    const deadline = this.get('model.deadlineAt');
    if (Ember.isBlank(deadline)) {
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
        this.get('model').hasMany('activities').reload();
      });
    }
  }

});
