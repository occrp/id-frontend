import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    payload.data = this.addLinks(payload.data);
    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  addLinks(ticket) {
    let adapter = Ember.getOwner(this).lookup('adapter:application');
    let namespace = adapter.get('namespace');

    ticket.relationships.activities = {
      links: {
        related: `/${namespace}/activities?filter[target_object_id]=${ticket.id}&include=comment,responder-user,user&page[number]=1&page[size]=50&sort=timestamp`
      }
    };
    return ticket;
  }
});
