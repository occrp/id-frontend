import paginate from './helpers/paginate';

export default function() {
  this.namespace = '/api';

  this.get('/tickets', (schema, request) => {
    let status = request.queryParams['filter[status]'];

    let collection = schema.tickets.where(function(ticket) {
      if (status === 'open') {
        return ticket.status === 'new' || ticket.status === 'in-progress';
      }
      if (status === 'closed') {
        return ticket.status === 'closed' || ticket.status === 'cancelled';
      }
      return true;
    });

    let totalOpen = schema.tickets.where({status: 'new'}).length + schema.tickets.where({status: 'in-progress'}).length;
    let totalClosed = schema.tickets.all().length - totalOpen;

    request.mirageMeta = {
      'total-open': totalOpen,
      'total-closed': totalClosed
    };

    return paginate(collection, request, this.namespace);
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

  this.patch('/tickets/:id', function(schema, request) {
    let attrs = JSON.parse(request.requestBody).data.attributes;
    let id = request.params.id;

    let model = schema.tickets.find(id);

    return model.update(attrs);
  });

  this.get('/users', (schema, request) => {
    let search = request.queryParams['filter[search]'];
    let ids = request.queryParams['filter[id]'];

    let collection = null;

    if (ids) {
      collection = schema.users.find(ids.split(','));
    } else {
      collection = schema.users.where(function(user) {
        if (search) {
          return user.firstName.indexOf(search) !== -1;
        }
        return true;
      });
    }

    return paginate(collection, request, this.namespace);
  });

  this.get('/users/:id', (schema, request) => {
    let id = request.params.id;
    return schema.users.find(id);
  });

}
