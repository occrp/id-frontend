import Ember from 'ember';
import ENV from 'id2-frontend/config/environment';

export default Ember.Component.extend({
  ENV,
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
