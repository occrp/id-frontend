import EmberInitials from 'ember-initials/components/initials'

export default EmberInitials.extend({
  classNames: ['avatar'],

  size: 20,
  fontSize: 50,
  fontFamily: 'sans-serif',
  textStyles: Object.freeze({
    'letter-spacing': '0.05em'
  }),

  init() {
    this.setProperties({
      name: this.get('user.displayName'),
      seedText: this.get('user.email')
    });

    if (this.get('preset') === 'large') {
      this.setProperties({
        size: 40,
        fontSize: 42
      });
    }

    this._super(...arguments);
  }
});
