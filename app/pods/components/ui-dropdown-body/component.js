import Ember from 'ember';
import ENV from 'id-frontend/config/environment';

export default Ember.Component.extend({
  tagName: '',
  i18n: Ember.inject.service(),

  targetAttachment: Ember.computed('i18n.isRtl', function() {
    return this.get('i18n.isRtl') ? 'bottom left' : 'bottom right';
  }),
  attachment: Ember.computed('i18n.isRtl', function() {
    return this.get('i18n.isRtl') ? 'top left' : 'top right';
  }),
  renderInPlace: ENV.environment === 'test'
});
