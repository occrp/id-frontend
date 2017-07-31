import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery (query) {
    if (query.filter) {
      if (query.filter['is-staff'] !== undefined) {
        query.filter['is_staff'] = query.filter['is-staff'];
        delete query.filter['is-staff'];
      }
      if (query.filter['is-superuser'] !== undefined) {
        query.filter['is_superuser'] = query.filter['is-superuser'];
        delete query.filter['is-superuser'];
      }
    }

    return this._super(...arguments);
  }
});
