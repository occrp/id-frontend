import paginate from './helpers/paginate';
import { upload } from 'ember-file-upload/mirage';

export default function() {
  this.namespace = '/api/v3';

  this.get('/tickets', (schema, request) => {
    let status = request.queryParams['filter[status]'].split(',');

    let collection = schema.tickets.where(function(ticket) {
      return status.includes(ticket.status);
    });

    let totalOpen = schema.tickets.where({status: 'new'}).length + schema.tickets.where({status: 'in-progress'}).length;
    let totalClosed = schema.tickets.all().length - totalOpen;

    let filters = {};

    let requester = request.queryParams['filter[requester]'];
    let responder = request.queryParams['filter[responder]'];

    if (requester) {
      let profile = schema.profiles.find(requester);
      filters.requester = {
        'first-name': profile.firstName,
        'last-name': profile.lastName
      };
    }

    if (responder && responder !== 'none') {
      let profile = schema.profiles.find(responder);
      filters.responder = {
        'first-name': profile.firstName,
        'last-name': profile.lastName
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
        verb: `ticket:update:status_${attrs.status}`,
        createdAt: (new Date()).toISOString(),
        ticket,
        user: schema.profiles.find(42)
      });
    }
    
    ticket.update(attrs);

    return ticket;
  });

  this.get('/profiles', (schema, request) => {
    let search = request.queryParams['filter[search]'];
    let isStaff = JSON.parse(request.queryParams['filter[is-staff]']);

    let collection = null;

    collection = schema.profiles.where(function(profile) {
      if (isStaff !== undefined && profile.isStaff !== isStaff) {
        return false;
      }
      if (search) {
        return profile.firstName.indexOf(search) !== -1;
      }
      return true;
    });

    collection.models = collection.models.slice(0, 6);

    return collection;
  });

  this.get('/profiles/:id', (schema, request) => {
    let id = request.params.id;
    return schema.profiles.find(id);
  });


  this.get('/activities', (schema, request) => {
    // not a standard endpoint. used in place of a ticket.activities relationship
    let ticketId = request.queryParams['filter[ticket]'];
    return schema.activities.where({ ticketId: ticketId });
  });


  this.post('/comments', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();

    let ticket = schema.tickets.find(attrs.ticketId);
    let profile = schema.profiles.find(attrs.userId);

    let comment = schema.comments.create(attrs);

    schema.activities.create({
      verb: 'comment:create',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: profile,
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
    let profile = schema.profiles.find(request.requestBody.user);

    schema.activities.create({
      verb: 'attachment:create',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: profile,
      attachment
    });

    return attachment;
  }, { network: '3g' }));


  this.post('/responders', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();
    attrs.updatedAt = (new Date()).toISOString();

    let ticket = schema.tickets.find(attrs.ticketId);
    let profile = schema.profiles.find(attrs.userId);

    let responder = schema.responders.create(attrs);

    schema.activities.create({
      verb: 'responder:create',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: schema.profiles.find(42),
      responderUser: profile
    });

    return responder;
  });


  this.del('/responders/:id', function (schema, request) {
    let responderId = request.params.id;

    let responder = schema.responders.find(responderId);
    let ticket = schema.tickets.find(responder.ticketId);
    let profile = schema.profiles.find(responder.userId);

    schema.activities.create({
      verb: 'responder:destroy',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: schema.profiles.find(42),
      responderUser: profile
    });

    responder.destroy();
  });

}
