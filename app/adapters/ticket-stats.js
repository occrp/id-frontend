import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery (query) {
    if (query.filter) {
      if (query.filter.profile) {
        query.filter['responders__user'] = query.filter.profile;

        delete query.filter.profile;
      }
      if (query.filter.startAt) {
        query.filter['created_at__gte'] = query.filter.startAt;
        delete query.filter.startAt;
      }
    }

    return this._super(...arguments);
  }
});
