import Ember from 'ember';
import { kindList, kindMap } from 'id2-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';

import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  kindList,
  kindMap,
  countries,

  title: Ember.computed('model.kind', function () {
    switch (this.get('model.kind')) {
      case kindList[0]:
        return this.get('model.displayName');
      case kindList[1]:
        return this.get('model.companyName');
      case kindList[2]:
        return 'Request';
    }
  }),

  session: Ember.inject.service(),

  uploadPhoto: task(function * (file) {
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
    } catch (e) {
      console.log('CATCH', e)
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    uploadImage(file) {
      this.get('uploadPhoto').perform(file);
    }
  }

});
