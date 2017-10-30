import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  tagName: '',
  currentValue: Ember.computed.readOnly('value'),
  theCenter: Ember.computed.oneWay('center'),

  isShowingPopup: false,
  attachment: 'bottom left',
  targetAttachment: 'top left',
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
      if (Ember.isBlank(val)) {
        this.get('onSelect')({date: null});
        return;
      }

      if (val.length < 10) {
        return;
      }

      let current = moment.utc(this.get('currentValue'));
      let date = moment.utc(val, 'DD/MM/YYYY');

      if (current.toDate().getTime() === date.toDate().getTime()) {
        return;
      }

      if (date.isValid()) {
        this.set('theCenter', date);
        this.get('onSelect')({date: date.toDate()});
      }
    }
  }
});
