import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  // Workaround until we have proper auth.
  // This should only happen for /me queries.
  normalizeQueryRecordResponse(store, primaryModelClass, payload, id, requestType) {
    let newPayload = {
      data: {
        id: payload.id,
        type: 'profile',
        attributes: {
          'first-name': payload.first_name,
          'last-name': payload.last_name,
          'email': payload.email,
          'is-staff': payload.is_staff,
          'is-superuser': payload.is_superuser,
          'tickets-count': payload.tickets_count
        }
      }
    };

    return this._super(store, primaryModelClass, newPayload, id, requestType);
  },
});
