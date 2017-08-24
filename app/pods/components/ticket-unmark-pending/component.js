import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  isShowingModal: false,

  actions: {
    save() {
      this.get('onSave')(this.get('activityType'));
      this.set('isShowingModal', false);
    }
  }

});
