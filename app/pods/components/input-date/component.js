import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  isShowingPopup: false,
  constraints: [
    {
      to: 'window',
      attachment: 'together'
    }
  ],

  actions: {

    open() {
      this.set('isShowingPopup', true);
    },

    close() {
      if (!this.get('isFocused')) {
        this.set('isShowingPopup', false);
      }
    },

    updateDatepicker(val) {
      if (val.length < 10) {
        return;
      }

      let date = moment(val, 'DD/MM/YYYY');

      if (date._isValid) {
        this.set('center', date._d);
        this.set('value', date._d);
      }
    }

  }
});
