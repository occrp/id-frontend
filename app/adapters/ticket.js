import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery (query) {
    if (query.filter) {
      if (query.filter.responder) {
        query.filter['users__in'] = query.filter.responder;
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
