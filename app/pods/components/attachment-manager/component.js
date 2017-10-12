import Ember from 'ember';
import { task, all } from 'ember-concurrency';
const { get, set } = Ember;

export default Ember.Component.extend({
  tagName: '',
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  batchUpload: task(function * (queue) {
    let childTasks = [];

    queue.files.forEach(file => {
      childTasks.push(this.get('uploadFile').perform(file));
    });

    yield all(childTasks);
  }).restartable(),

  uploadFile: task(function * (file) {
    let adapter = Ember.getOwner(this).lookup('adapter:application');
    let namespace = adapter.get('namespace');

    try {
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
      this.get('model').hasMany('activities').reload();
    } catch (e) {
      // console.log('CATCH', e)
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    startUploads(queue, triggerClose) {
      this.get('batchUpload').perform(queue).then(() => {
        triggerClose();
      });
    },

    flushQueue(queue) {
      get(queue, 'files').forEach((file) => set(file, 'queue', null));
      set(queue, 'files', Ember.A());
    }
  }

});
