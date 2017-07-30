import Ember from 'ember';

export default Ember.Mixin.create({
  displayName: Ember.computed('firstName', 'lastName', function () {
    const firstName = this.get('firstName');
    const lastName = this.get('lastName');

    if (!firstName && !lastName) {
      return this.get('email');
    }

    return `${firstName} ${lastName}`.trim();
  })
});
