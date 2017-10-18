import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  tagName: '',
  currentValue: Ember.computed.readOnly('value'),

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

      let current = moment.utc(this.get('currentValue'));
      let date = moment.utc(val, 'DD/MM/YYYY');

      if (current.toDate().getTime() === date.toDate().getTime()) {
        return;
      }

      if (date.isValid()) {
        this.set('center', date);
        this.get('onSelect')({date: date.toDate()});
      }
    }
  }
});
