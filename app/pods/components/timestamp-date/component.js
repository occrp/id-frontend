import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  tagName: '',
  i18n: service(),
  format: computed('date', 'i18n.locale', function () {
    let showYear = moment.utc(this.get('date')).year() !== moment.utc().year();

    return showYear ?
      this.get('i18n').t('time.default').string :
      this.get('i18n').t('time.defaultCurrentYear').string;
  }),
}).reopenClass({
  positionalParams: ['date']
});
