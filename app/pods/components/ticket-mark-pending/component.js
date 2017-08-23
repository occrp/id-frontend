import Ember from 'ember';
import { Validations } from 'id-frontend/models/comment';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service(),

  isShowingModal: false,

  body: null,
  didValidate: false,

  actions: {
    save() {
      this.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          this.get('onSave')(this.get('body'));
          this.set('isShowingModal', false);
        }
      });
    }
  }

});
