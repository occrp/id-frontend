import Ember from 'ember';

export default Ember.Component.extend({
  isShowingModal: false,

  actions: {
    save() {
      this.get('onSave')(this.get('activityType'));
      this.set('isShowingModal', false);
    }
  }

});
