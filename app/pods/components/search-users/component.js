import Component from '@ember/component';

export default Component.extend({
  isStaff: false,
  preloadEmpty: true,
  autoFocus: true,
  inputClassNames: 'db w-100 ba br1 pa2 b--moon-gray bg-white',
  baseClassNames: 'searchBox',
  noModal: true,

  didInsertElement() {
    if (this.get('preloadEmpty')) {
      let last = this.get('task.lastSuccessful');
      if (!last || last.args[0] !== '') {
        this.get('task').perform('');
      }
    }

    if (this.get('autoFocus')) {
      this.element.querySelector('input').focus();
    }
  }
});
