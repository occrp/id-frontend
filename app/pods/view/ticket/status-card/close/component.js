import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    save(triggerClose) {
      this.get('onSave')(this.get('activityType'));
      triggerClose();
    }
  }

});
