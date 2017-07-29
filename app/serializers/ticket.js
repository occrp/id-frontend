import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalizeFindRecordResponse(store, type, payload) {
    payload.data = this.addLinks(payload.data);
    return this._super(store, type, payload);
  },

  addLinks(ticket) {
    let adapter = Ember.getOwner(this).lookup('adapter:application');
    let namespace = adapter.get('namespace');

    ticket.relationships.activities = {
      links: {
        related: `/${namespace}/activities?filter[target_object_id]=${ticket.id}`
      }
    };
    return ticket;
  }
});
