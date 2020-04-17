import { camelCaseKeys } from './application';
import ApplicationSerializer from './application';
import { inject as service } from '@ember/service';

export default ApplicationSerializer.extend({
  session: service(),

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    this.set('session.currentUserMeta', camelCaseKeys(payload.meta));
    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
