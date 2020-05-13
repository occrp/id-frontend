import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { get } from '@ember/object';
import BaseHelper from 'ember-moment/helpers/-base';

momentDurationFormatSetup(moment);

export default BaseHelper.extend({
  compute(params, { locale, timeZone }) {
    this._super(...arguments);
    const momentService = get(this, 'moment');

    if (!params || params && params.length > 2) {
      throw new TypeError('ember-moment: Invalid Number of arguments, at most 2');
    }

    const result = momentService.moment(moment.duration(...params));

    return this.morphMoment(result._i, { locale, timeZone }).format({
      template: 'd[d], h[h]',
      trim: 'both'
    });
  }
});
