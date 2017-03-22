import Ember from 'ember';
import { task } from 'ember-concurrency';
import { Validations } from 'id2-frontend/models/activity';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  comment: null,

  didValidate: false,

  publishComment: task(function * () {
    let record = this.get('store').createRecord('activity', {
      type: 'update',
      comment: this.get('comment'),
      ticket: this.get('parent'),
      author: this.get('session.currentUser')
    });
    yield record.save();
    this.set('comment', null);
    this.set('didValidate', false);
    return record;
  }),

  actions: {
    save() {
      this.validate().then(({ validations }) => {
        this.set('didValidate', true);
        if (validations.get('isValid')) {
          this.get('publishComment').perform();
        }
      });
    }
  }

});
