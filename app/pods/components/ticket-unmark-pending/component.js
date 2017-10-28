import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    save(triggerClose) {
      this.get('onSave')(this.get('activityType'));
      triggerClose();
    }
  }

});
