import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery (query) {
    if (query.filter) {
      if (query.filter.responder) {
        const value = query.filter.responder;

        if (value === 'none') {
          query.filter['responders__user__isnull'] = true;
        } else {
          query.filter['responders__user'] = value;
        }

        delete query.filter.responder;
      }     
      if (query.filter.status) {
        query.filter['status__in'] = query.filter.status;
        delete query.filter.status;
      }
    }

    return this._super(...arguments);
  }
});
