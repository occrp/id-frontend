import Component from '@ember/component';
import { Validations } from 'id-frontend/models/comment';

export default Component.extend(Validations, {
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
