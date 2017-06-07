import Ember from 'ember';
import { typeList, typeMap } from 'id2-frontend/models/ticket';
import countries from 'ember-i18n-iso-countries/langs/en';

import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  typeList,
  typeMap,
  countries,

  title: Ember.computed('model.type', function () {
    switch (this.get('model.type')) {
      case typeList[0]:
        return this.get('model.displayName');
      case typeList[1]:
        return this.get('model.companyName');
      case typeList[2]:
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
