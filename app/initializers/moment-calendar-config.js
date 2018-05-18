import moment from 'moment'

export function initialize() {
  moment.calendarFormat = function (myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);

    var retVal =  diff < -1 ? 'sameElse' :
        diff < 0 ? 'lastDay' :
        diff < 1 ? 'sameDay' :
        diff < 2 ? 'nextDay' : 'sameElse';
    return retVal;
  };
}

export default {
  initialize
};
