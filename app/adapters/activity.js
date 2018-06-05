import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery (query) {
    if (query.filter) {
      if (query.filter.startAfter) {
        query.filter['start_after'] = query.filter.startAfter;
        delete query.filter.startAfter;
      }
    }

    return this._super(...arguments);
  }
});
