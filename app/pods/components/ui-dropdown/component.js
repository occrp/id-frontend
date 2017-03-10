import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'dd',
  isShowingDropdown: false,

  targetAttachment: 'bottom right',
  attachment: 'top right',

  slug: Ember.computed('name', function () {
    return Ember.String.dasherize(this.get('name'));
  }),

  actions: {
    close() {
      this.set('isShowingDropdown', false);
    }
  }
});
