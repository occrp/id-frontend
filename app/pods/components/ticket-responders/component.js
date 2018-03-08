import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  firstItem: computed('data.[]', function() {
    return this.get('data').get('firstObject');
  })
});
