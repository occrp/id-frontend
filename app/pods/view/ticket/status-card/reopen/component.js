import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  body: null,

  actions: {
    save(triggerClose) {
      if (this.get('body')) {
        this.get('onSave')(this.get('body'));
        triggerClose();
      }
    }
  }

});
