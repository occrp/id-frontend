import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  displayName: computed('firstName', 'lastName', function() {
    const firstName = this.get('firstName');
    const lastName = this.get('lastName');

    if (!firstName && !lastName) {
      return this.get('email');
    }

    return `${firstName} ${lastName}`.trim();
  })
});
