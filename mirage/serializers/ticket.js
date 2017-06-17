import Serializer from './application';

export default Serializer.extend({
  links(ticket) {
    return {
      'activities': {
        related: `/api/3/activities/${ticket.id}`
      }
    };
  },

  serialize(object, request) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    // Imitates the actual API since the back-end will not include the link
    // defined above (adding it via the app's ticket serializer) 
    if (json.data.relationships) {
      delete json.data.relationships.activities;
    }
    return json;
  }
});
