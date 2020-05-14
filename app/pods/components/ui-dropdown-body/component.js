import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'id-frontend/config/environment';

export default Component.extend({
  tagName: '',
  intl: service(),
  noModal: false,

  targetAttachment: computed('intl.isRtl', function() {
    return this.get('intl.isRtl') ? 'bottom left' : 'bottom right';
  }),
  attachment: computed('intl.isRtl', function() {
    return this.get('intl.isRtl') ? 'top left' : 'top right';
  }),
  renderInPlace: computed('noModal', function() {
    if (ENV.environment === 'test') {
      return true;
    }

    return this.get('noModal');
  })
});
