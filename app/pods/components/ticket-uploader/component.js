import Ember from 'ember';
import { task } from 'ember-concurrency';


export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  uploadFile: task(function * (file) {
    let adapter = Ember.getOwner(this).lookup('adapter:application');
    let namespace = adapter.get('namespace');

    try {
      let response = yield file.upload(`/${namespace}/attachments`, {
        data: {
          ticket: this.get('model.id'),
          user: this.get('session.currentUser.id')
        }
      });

      this.get('store').pushPayload('attachment', response.body);
      this.get('model').hasMany('activities').reload();
    } catch (e) {
      console.log('CATCH', e)
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    addFile(file) {
      this.get('uploadFile').perform(file);
    }
  }

});
