import Ember from 'ember';
import { task, all } from 'ember-concurrency';
const { get, set } = Ember;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  isShowingModal: false,

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
        accepts: [
          'text/html',
          'application/xml',
          'application/xhtml+xml'
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
      console.log('CATCH', e)
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    startUploads(queue) {
      this.get('batchUpload').perform(queue).then(() => {
        this.set('isShowingModal', false);
      });
    },

    flushQueue(queue) {
      get(queue, 'files').forEach((file) => set(file, 'queue', null));
      set(queue, 'files', Ember.A());
    }
  }

});
