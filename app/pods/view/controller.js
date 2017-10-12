import Ember from 'ember';
import { task } from 'ember-concurrency';
import { kindList } from 'id-frontend/models/ticket';
// import countries from 'ember-i18n-iso-countries/langs/en';

export default Ember.Controller.extend({
  kindList,

  title: Ember.computed('model.kind', function () {
    switch (this.get('model.kind')) {
      case kindList[2]:
        return 'Request';
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
