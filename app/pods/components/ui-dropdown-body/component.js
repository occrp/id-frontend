import Ember from 'ember';
import ENV from 'id2-frontend/config/environment';

export default Ember.Component.extend({
  tagName: '',
  ENV,

  targetAttachment: 'bottom right',
  attachment: 'top right'
});
