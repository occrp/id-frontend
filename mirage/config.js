import paginate from './helpers/paginate';
import { upload } from 'ember-file-upload/mirage';

import Ember from 'ember';
const { underscore } = Ember.String;

export default function() {
  this.namespace = '/api/v3';

  this.get('/me', function (schema) {
    let attrs = schema.profiles.find(42).attrs;
    let processedAttrs = {};

    Object.keys(attrs).forEach(function(key) {
      processedAttrs[underscore(key)] = attrs[key];
    });

    return processedAttrs;
  }, { timing: 0 });


  this.get('/tickets', (schema, request) => {
    let status = request.queryParams['filter[status__in]'].split(',');

    let collection = schema.tickets.where(function(ticket) {
      return status.includes(ticket.status);
    });

    let filters = {};

    let requester = request.queryParams['filter[requester]'];
    let responder = request.queryParams['filter[responders]'];

    if (requester) {
      let profile = schema.profiles.find(requester);
      filters.requester = {
        'first-name': profile.firstName,
        'last-name': profile.lastName,
        'email': profile.email
      };
    }

    if (responder && responder !== 'none') {
      let profile = schema.profiles.find(responder);
      filters.responders = {
        'first-name': profile.firstName,
        'last-name': profile.lastName,
        'email': profile.email
      };
    }

    request.mirageMeta = {
      total: {
        'new': schema.tickets.where({status: 'new'}).length,
        'in-progress': schema.tickets.where({status: 'in-progress'}).length,
        'closed': schema.tickets.where({status: 'closed'}).length,
        'cancelled': schema.tickets.where({status: 'cancelled'}).length
      },
      filters
    };

    return paginate(collection, request, this.namespace);
  });

  this.get('/tickets/:id', (schema, request) => {
    let id = request.params.id;
    return schema.tickets.find(id);
  });

  this.post('/tickets', (schema) => {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();
    attrs.updatedAt = (new Date()).toISOString();

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
    let search = request.queryParams['filter[name]'];
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
    let ticketId = request.queryParams['filter[target_object_id]'];
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


  this.post('/attachments', upload(function (schema, request) {
    let file = request.requestBody.upload;
    let meta = JSON.parse(request.requestBody.ticket);

    let attachment = schema.attachments.create({
      url: file.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
      userId: 42,
      ticketId: meta.id
    });

    let ticket = schema.tickets.find(request.requestBody.ticket);
    let profile = schema.profiles.find(42);

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
