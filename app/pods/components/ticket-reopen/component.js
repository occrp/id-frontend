import Ember from 'ember';
import { Validations } from 'id-frontend/models/comment';

export default Ember.Component.extend(Validations, {
  tagName: '',

  body: null,
  didValidate: false,

  actions: {
    save(triggerClose) {
      this.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          this.get('onSave')(this.get('body'));
          triggerClose();
        }
      });
    }
  }

});
