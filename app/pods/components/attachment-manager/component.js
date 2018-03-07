import Ember from 'ember';
import { task, taskGroup } from 'ember-concurrency';
const { get, set } = Ember;
import RSVP from 'rsvp';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  i18n: Ember.inject.service(),
  activityBus: Ember.inject.service(),

  removalBin: null,

  processedAttachments: Ember.computed('model.attachments.[]', function() {
    const attachments = this.get('model.attachments');
    let groups = [];
    let prevItem = null;

    attachments.forEach((item) => {
      const userId = item.get('user.id');
      let currentGroup = groups.length ? groups[groups.length - 1] : null;

      if (!groups.length || prevItem.get('user.id') !== userId) {
        currentGroup = {
          user: item.get('user'),
          models: []
        };
        groups.push(currentGroup)
      }

      currentGroup.models.push(item);
      prevItem = item;
    })

    return groups;
  }),

  firstBatch: true,

  batchUpload: taskGroup().maxConcurrency(3).enqueue(),

  uploadFile: task(function * (file) {
    let adapter = Ember.getOwner(this).lookup('adapter:application');
    let namespace = adapter.get('namespace');

    let response = yield file.upload(`/${namespace}/attachments`, {
      fileKey: 'upload',
      accepts: [
        '*/*',
      ],
      data: {
        ticket: JSON.stringify(
          {id: this.get('model.id'), type: 'tickets'}
        ),
      }
    });

    this.get('store').pushPayload('attachment', response.body);
  }).group('batchUpload'),

  removeAttachment: task(function * (file) {
    try {
      yield file.destroyRecord();
      this.get('activityBus').trigger('reload');
    } catch (error) {
      this.get('flashMessages').danger('errors.genericRequest');
    }
  }),

  actions: {
    startUploads(queue, triggerClose) {
      let childTasks = [];
      this.set('firstBatch', false);

      queue.files.filter(file => ['uploaded', 'aborted'].indexOf(file.state) === -1).forEach(file => {
        childTasks.push(this.get('uploadFile').perform(file));
      });

      RSVP.allSettled(childTasks).then(() => {
        this.get('activityBus').trigger('reload');

        if(queue.files.length === 0) {
          triggerClose();
          this.set('firstBatch', true);
        }
      });
    },

    flushQueue(queue) {
      this.get('batchUpload').cancelAll();
      get(queue, 'files').forEach((file) => set(file, 'queue', null));
      set(queue, 'files', Ember.A());
      this.set('firstBatch', true)
    },

    addToRemovalBin(file) {
      this.set('removalBin', file);
    },

    emptyRemovalBin() {
      this.set('removalBin', null);
    },

    removeFile(triggerClose) {
      this.get('removeAttachment').perform(this.get('removalBin')).then(() => {
        triggerClose();
      });
    }
  }

});
