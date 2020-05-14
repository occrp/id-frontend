import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  tagName: '',
  intl: service(),
  format: computed('date', 'intl.locale', function () {
    let showYear = moment.utc(this.get('date')).year() !== moment.utc().year();

    return showYear ?
      this.get('intl').t('time.default') :
      this.get('intl').t('time.defaultCurrentYear');
  }),
}).reopenClass({
  positionalParams: ['date']
});
