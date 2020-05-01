import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'id-frontend/config/environment';

export default Component.extend({
  tagName: '',
  i18n: service(),
  noModal: false,

  targetAttachment: computed('i18n.isRtl', function() {
    return this.get('i18n.isRtl') ? 'bottom left' : 'bottom right';
  }),
  attachment: computed('i18n.isRtl', function() {
    return this.get('i18n.isRtl') ? 'top left' : 'top right';
  }),
  renderInPlace: computed('noModal', function() {
    if (ENV.environment === 'test') {
      return true;
    }

    return this.get('noModal');
  })
});
