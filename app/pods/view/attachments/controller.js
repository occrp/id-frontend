import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { task, taskGroup } from 'ember-concurrency';
import RSVP from 'rsvp';
import Controller from '@ember/controller';
import Pageable from 'id-frontend/mixins/pageable';

export default Controller.extend(Pageable, {
  store: service(),
  session: service(),
  flashMessages: service(),
  intl: service(),
  activityBus: service(),
  fileQueue: service(),

  removalBin: null,
  queueName: 'documents',

  batchUpload: taskGroup().maxConcurrency(3).enqueue(),

  ticket: computed('model.@each', function() {
    return this.get('model.firstObject.ticket');
  }),

  queue: computed('queueName', function() {
    let queues = this.get('fileQueue');

    return queues.find(this.get('queueName')) ||
      queues.create(this.get('queueName'));
  }),

  pendingFiles: computed('queue.files.@each.state', function() {
    return this.get('queue.files').filter(function(file) {
      return file.state !== 'uploaded';
    });
  }),

  uploadFile: task(function * (file) {
    let adapter = getOwner(this).lookup('adapter:application');
    let namespace = adapter.get('namespace');

    let response = yield file.upload(`/${namespace}/attachments`, {
      fileKey: 'upload',
      accepts: [
        '*/*',
      ],
      data: {
        ticket: JSON.stringify(
          {id: this.get('ticket.id'), type: 'tickets'}
        ),
      }
    });

    this.get('store').pushPayload('attachment', response.body);
  }).group('batchUpload'),

  removeAttachment: task(function * (file) {
    yield file.destroyRecord().then(() => {
      this.get('activityBus').trigger('reload');
    }).catch(() => {
      this.get('flashMessages').danger('errors.genericRequest');
    })
  }),

  actions: {
    startUploads() {
      let childTasks = [];
      let queue = this.get('queue');

      queue.files.filter(file => ['uploaded', 'aborted'].indexOf(file.state) === -1).forEach(file => {
        childTasks.push(this.get('uploadFile').perform(file));
      });

      RSVP.allSettled(childTasks).then(() => {
        this.get('ticket.expenses').reload();
        this.get('activityBus').trigger('reload');
      });
    },

    flushQueue() {
      let queue = this.get('queue');

      this.get('batchUpload').cancelAll();
      get(queue, 'files').setEach('queue', null);
      get(queue, 'files').clear();
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
