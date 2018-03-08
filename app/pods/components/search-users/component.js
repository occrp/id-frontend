import Component from '@ember/component';

export default Component.extend({
  isStaff: false,
  preloadEmpty: true,

  didInsertElement() {
    if (this.get('preloadEmpty')) {
      let last = this.get('task.lastSuccessful');
      if (!last || last.args[0] !== '') {
        this.get('task').perform('');
      }
    }

    this.$('input').focus();
  }

});
