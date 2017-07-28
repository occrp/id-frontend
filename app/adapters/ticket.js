import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery (query) {
    if (query.filter && query.filter.status) {
      query.filter['status__in'] = query.filter.status;
      delete query.filter.status;
    }

    return this._super(...arguments);
  }
});