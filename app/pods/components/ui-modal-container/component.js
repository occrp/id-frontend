import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  isShowing: false,

  actions: {
    toggle() {
      this.toggleProperty('isShowing');
      document.body.classList.toggle('modal-open');
    },

    open() {
      if (this.get('isShowing') === true) {
        return;
      }

      this.set('isShowing', true);

      document.body.classList.toggle('modal-open');
    },

    close() {
      if (this.get('isShowing') === false) {
        return;
      }

      this.set('isShowing', false);

      document.body.classList.toggle('modal-open');
    }
  }
});
