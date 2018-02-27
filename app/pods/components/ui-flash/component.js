import { computed, getWithDefault } from '@ember/object';
import FlashComponent from 'ember-cli-flash/components/flash-message';

export default FlashComponent.extend({
  alertType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');
      return `alert alert--${flashType} alert--topFlush`;
    }
  })
});
