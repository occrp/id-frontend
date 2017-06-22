import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  currentValue: Ember.computed.oneWay('value'),

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

      let date = moment.utc(val, 'DD/MM/YYYY');

      if (date._isValid) {
        this.set('center', date._d);
        this.set('currentValue', date._d);
      }
    },

    updateValue(val) {
      let date = moment.utc(val, 'DD/MM/YYYY');

      if (date._isValid) {
        this.get('onSelect')({date: date._d});
      }
    }

  }
});
