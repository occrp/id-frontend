import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  tagName: '',
  intl: service(),
  formatOpts: computed('date', 'intl.locale', function () {
    let showYear = moment.utc(this.get('date')).year() !== moment.utc().year();

    return showYear ? {
      sameElse: this.get('intl').t('time.full')
    } : {
      sameElse: this.get('intl').t('time.fullCurrentYear')
    };
  }),

}).reopenClass({
  positionalParams: ['date']
});
