import paginate from './helpers/paginate';
import { upload } from 'ember-file-upload/mirage';

export default function() {
  this.namespace = '/api/3';

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

    let filters = {};

    let requester = request.queryParams['filter[requester]'];
    let responder = request.queryParams['filter[responder]'];

    if (requester) {
      let user = schema.users.find(requester);
      filters.requester = {
        'first-name': user.firstName,
        'last-name': user.lastName
      };
    }

    if (responder && responder !== 'none') {
      let user = schema.users.find(responder);
      filters.responder = {
        'first-name': user.firstName,
        'last-name': user.lastName
      };
    }

    request.mirageMeta = {
      'total-open': totalOpen,
      'total-closed': totalClosed,
      filters
    };

    return paginate(collection, request, this.namespace);
  });

  this.get('/tickets/:id', (schema, request) => {
    let id = request.params.id;
    return schema.tickets.find(id);
  });

  this.post('/tickets', (schema, request) => {
    let attrs = JSON.parse(request.requestBody).data.attributes;

    attrs.createdAt = (new Date()).toISOString();

    return schema.tickets.create(attrs);
  });

  this.patch('/tickets/:id', function(schema, request) {
    let id = request.params.id;
    let attrs = this.normalizedRequestAttrs();

    let ticket = schema.tickets.find(id);

    // if (attrs.responderId && attrs.status === 'new') {
    //   attrs.status = 'in-progress';
    // }

    let oldStatus = ticket.status;

    if (oldStatus !== attrs.status) {
      schema.activities.create({
        verb: `status_${attrs.status}`,
        createdAt: (new Date()).toISOString(),
        ticket,
        user: schema.users.find(42)
      });
    }
    
    ticket.update(attrs);

    return ticket;
  });

  this.get('/users', (schema, request) => {
    let search = request.queryParams['filter[search]'];
    let isStaff = JSON.parse(request.queryParams['filter[is-staff]']);

    let collection = null;

    collection = schema.users.where(function(user) {
      if (isStaff !== undefined && user.isStaff !== isStaff) {
        return false;
      }
      if (search) {
        return user.firstName.indexOf(search) !== -1;
      }
      return true;
    });

    collection.models = collection.models.slice(0, 6);

    return collection;
  });

  this.get('/users/:id', (schema, request) => {
    let id = request.params.id;
    return schema.users.find(id);
  });

  this.post('/activities', (schema, request) => {
    let data = JSON.parse(request.requestBody).data;
    let attrs = data.attributes;
    let rels = data.relationships;

    attrs.createdAt = (new Date()).toISOString();
    attrs.userId = rels.user.data.id;
    attrs.ticketId = rels.ticket.data.id;

    let ticket = schema.tickets.find(rels.ticket.data.id);

    switch (attrs.type) {
      case 'cancel':
        ticket.update({ status: 'cancelled' });
        break;
      case 'close':
        ticket.update({ status: 'closed' });
        break;
      case 'reopen':
        if (ticket.responder) {
          ticket.update({ status: 'in-progress' });
        } else {
          ticket.update({ status: 'new' });
        }
    }

    return schema.activities.create(attrs);
  });


  this.get('/activities/:id', (schema, request) => {
    let ticketId = request.params.id;
    return schema.activities.where({ ticketId: ticketId });
  });


  this.post('/comments', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();

    let ticket = schema.tickets.find(attrs.ticketId);
    let user = schema.users.find(attrs.userId);

    let comment = schema.comments.create(attrs);

    schema.activities.create({
      verb: 'comment',
      createdAt: (new Date()).toISOString(),
      ticket,
      user,
      comment
    });

    return comment;
  });

  this.get('/me', () => {
    return {
      "id": 42,
      "email": "user@mail.com",
      "first_name": "John",
      "last_name": "Appleseed",
      "is_staff": true,
      "is_superuser": false,
      "locale": ""
    };
  }, { timing: 0 });

  this.post('/attachments', upload(function (schema, request) {
    let file = request.requestBody.file;

    let attachment = schema.attachments.create({
      url: file.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
      userId: request.requestBody.user,
      ticketId: request.requestBody.ticket
    });

    let ticket = schema.tickets.find(request.requestBody.ticket);
    let user = schema.users.find(request.requestBody.user);

    schema.activities.create({
      verb: 'attached',
      createdAt: (new Date()).toISOString(),
      ticket,
      user,
      attachment
    });

    return attachment;
  }));

}
