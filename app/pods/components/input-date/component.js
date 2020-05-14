import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { readOnly, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  tagName: '',
  intl: service(),

  currentValue: readOnly('value'),
  theCenter: oneWay('center'),

  isShowingPopup: false,

  attachment: computed('intl.isRtl', function() {
    return this.get('intl.isRtl') ? 'bottom right' : 'bottom left';
  }),
  targetAttachment: computed('intl.isRtl', function() {
    return this.get('intl.isRtl') ? 'top right' : 'top left';
  }),
  constraints: Object.freeze([
    {
      to: 'window',
      attachment: 'together'
    }
  ]),

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
      if (isBlank(val)) {
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
