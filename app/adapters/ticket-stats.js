import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery (query) {
    if (query.filter) {
      if (query.filter.profile) {
        const value = query.filter.profile;
        query.filter['responders__user'] = value;

        delete query.filter.profile;
      }
    }

    return this._super(...arguments);
  }
});
