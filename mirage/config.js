export default function() {
  this.namespace = '/api';

  this.get('/tickets', (schema, request) => {
    let status = request.queryParams['filter[ticket][status]'];

    let collection = schema.tickets.where(function(ticket) {
      if (status === 'open') {
        return ticket.status === 'new' || ticket.status === 'in-progress';
      }
      if (status === 'closed') {
        return ticket.status === 'closed' || ticket.status === 'cancelled';
      }
    });

    request.mirageMeta = {
      'total-open': 42,
      'total-closed': 3
    }

    return collection;
  });

  this.get('/tickets/:id', (schema, request) => {
    let id = request.params.id;
    return schema.tickets.find(id);
  });

  this.post('/tickets', (schema, request) => {
    let attrs = JSON.parse(request.requestBody).data.attributes;

    attrs.created = (new Date()).toISOString();

    return schema.tickets.create(attrs);
  });
}
