import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { Validations } from 'id-frontend/models/comment';

export default Component.extend(Validations, {
  store: service(),
  session: service(),
  activityBus: service(),

  body: null,
  didValidate: false,

  publishComment: task(function * () {
    let record = this.get('store').createRecord('comment', {
      body: this.get('body'),
      ticket: this.get('model'),
      user: this.get('session.currentUser')
    });
    yield record.save();
  }),

  actions: {
    save() {
      this.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          this.get('publishComment').perform().then(() => {
            this.set('body', null);
            this.set('didValidate', false);
            this.get('activityBus').trigger('reload');
          });
        }
      });
    }
  }

});
