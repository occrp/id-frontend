import paginate from './helpers/paginate';
import { upload } from 'ember-file-upload/mirage';
import Response from 'ember-cli-mirage/response';

export default function() {
  this.namespace = '/api/v3';

  this.get('/me', function (schema) {
    return schema.profiles.find(42);
  }, { timing: 0 });


  this.get('/tickets', (schema, request) => {
    let status = request.queryParams['filter[status__in]'].split(',');
    let collection = schema.tickets.where(function(ticket) {
      return status.includes(ticket.status);
    });

    let filters = {};

    let requester = request.queryParams['filter[requester]'];
    let responder = request.queryParams['filter[responders__user]'];

    if (requester) {
      let profile = schema.profiles.find(requester);
      filters.requester = {
        'first-name': profile.firstName,
        'last-name': profile.lastName,
        'email': profile.email
      };
    }

    // not covering responder = 'none' anymore
    // since the adapter moves it on a separate key
    if (responder) {
      let profile = schema.profiles.find(responder);
      filters.responder = {
        'first-name': profile.firstName,
        'last-name': profile.lastName,
        'email': profile.email
      };
    }

    request.mirageMeta = {
      total: {
        'all': schema.tickets.all().length,
        'new': schema.tickets.where({status: 'new'}).length,
        'in-progress': schema.tickets.where({status: 'in-progress'}).length,
        'pending': schema.tickets.where({status: 'pending'}).length,
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


  this.post('/tickets', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();
    attrs.updatedAt = (new Date()).toISOString();

    return schema.tickets.create(attrs);
  });

  this.patch('/tickets/:id', function(schema, request) {
    let id = request.params.id;
    let attrs = this.normalizedRequestAttrs();

    let ticket = schema.tickets.find(id);
    let oldStatus = ticket.status;

    if (oldStatus !== attrs.status) {
      let activityAttrs = {
        verb: `ticket:update:status_${attrs.status}`,
        createdAt: (new Date()).toISOString(),
        ticket,
        user: schema.profiles.find(42)
      }

      if (attrs.reopenReason) {
        activityAttrs.verb = 'ticket:update:reopen';

        let comment = schema.comments.create({
          body: attrs.reopenReason,
          createdAt: (new Date()).toISOString(),
          ticket,
          user: schema.profiles.find(42),
        });

        activityAttrs.comment = comment;
        attrs.reopenReason = null;
      }

      if (attrs.pendingReason) {
        activityAttrs.verb = 'ticket:update:pending';

        let comment = schema.comments.create({
          body: attrs.pendingReason,
          createdAt: (new Date()).toISOString(),
          ticket,
          user: schema.profiles.find(42),
        });

        activityAttrs.comment = comment;
        attrs.pendingReason = null;
      }

      schema.activities.create(activityAttrs);
    }

    ticket.update(attrs);

    return ticket;
  });

  this.get('/profiles', (schema, request) => {
    const qp = request.queryParams;
    const search = qp['filter[name]'];
    const isStaff = qp['filter[is_staff]'] ? JSON.parse(qp['filter[is_staff]']) : undefined;

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

  this.patch('/profiles/:id');

  this.get('/activities', (schema, request) => {
    // not a standard endpoint. used in place of a ticket.activities relationship
    let ticketId = request.queryParams['filter[target_object_id]'];
    let verb = request.queryParams['filter[verb]'];
    let cursor = request.queryParams['filter[id__lt]'];

    let filters = { ticketId };
    if (verb) {
      filters.verb = verb;
    }

    let collection = schema.activities.where(filters);

    collection = collection.sort((a, b) => {
      return (new Date(a.attrs.createdAt) - new Date(b.attrs.createdAt)) * -1;
    });

    if (collection.length) {
      request.mirageMeta = {
        'first-id': collection.models[0].id,
        'last-id': collection.models[collection.length - 1].id
      };
    }

    if (cursor) {
      let last = schema.activities.find(cursor);

      collection = collection.filter((model) => {
        return new Date(model.createdAt) < new Date(last.createdAt);
      })
    }

    request.queryParams['page[number]'] = 1;

    return paginate(collection, request, this.namespace);
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


  this.post('/expenses', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();

    let ticket = schema.tickets.find(attrs.ticketId);
    let profile = schema.profiles.find(attrs.userId);

    let expense = schema.expenses.create(attrs);

    schema.activities.create({
      verb: 'expense:create',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: profile,
      expense
    });

    return expense;
  });

  this.get('/expenses/:id', function (schema, request) {
    return schema.expenses.find(request.params.id);
  });

  this.del('/expenses/:id', function (schema, request) {
    let expenseId = request.params.id;

    let expense = schema.expenses.find(expenseId);
    let ticket = schema.tickets.find(expense.ticketId);

    schema.activities.create({
      verb: 'expense:destroy',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: schema.profiles.find(42)
    });

    expense.destroy();
  });


  this.post('/attachments', upload(function (schema, request) {
    let file = request.requestBody.upload;
    let meta = JSON.parse(request.requestBody.ticket);

    let attachment = schema.attachments.create({
      upload: file.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
      userId: 42,
      ticketId: meta.id
    });

    let ticket = schema.tickets.find(meta.id);
    let profile = schema.profiles.find(42);

    schema.activities.create({
      verb: 'attachment:create',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: profile,
      attachment
    });

    if (Math.random() < 0.75) {
      return attachment;
    }

    return new Response(500, {}, {
      errors: [{ detail: file.name }]
    });
  }, { network: '3g' }));


  this.del('/attachments/:id', function (schema, request) {
    let attachmentId = request.params.id;

    let attachment = schema.attachments.find(attachmentId);
    let ticket = schema.tickets.find(attachment.ticketId);

    schema.activities.create({
      verb: 'attachment:destroy',
      createdAt: (new Date()).toISOString(),
      ticket,
      user: schema.profiles.find(42)
    });

    attachment.destroy();
  });


  this.post('/responders', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();
    attrs.updatedAt = (new Date()).toISOString();

    let ticket = schema.tickets.find(attrs.ticketId);
    let profile = schema.profiles.find(attrs.userId);

    if (ticket.status === 'new') {
      ticket.update('status', 'in-progress');
    }

    let responder = schema.responders.create(attrs);
    ticket.responders.add(responder);

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

  this.post('/subscribers', function (schema) {
    let attrs = this.normalizedRequestAttrs();

    attrs.createdAt = (new Date()).toISOString();
    attrs.updatedAt = (new Date()).toISOString();

    // let ticket = schema.tickets.find(attrs.ticketId);
    let profile = schema.profiles.findBy({ email: attrs.email });

    let subscriber = schema.subscribers.create(Object.assign({}, attrs, {
      user: attrs.email === 'user@mail.com' ? null : profile
    }));

    return subscriber;
  });

  this.del('/subscribers/:id', function (schema, request) {
    let subscriberId = request.params.id;

    let subscriber = schema.subscribers.find(subscriberId);
    // let ticket = schema.tickets.find(subscriber.ticketId);
    // let profile = schema.profiles.find(subscriber.userId);

    // schema.activities.create({
    //   verb: 'subscriber:destroy',
    //   createdAt: (new Date()).toISOString(),
    //   ticket,
    //   user: schema.profiles.find(42),
    //   subscriberUser: profile
    // });

    subscriber.destroy();
  });


  this.get('/ticket-stats', (schema, request) => {
    let profileId = request.queryParams['filter[responders__user]'];

    let filters = {};

    if (profileId) {
      filters.profileId = profileId
    }

    request.mirageMeta = {
      'staff-profile-ids': [51, 52, 53],
      countries: ['AU', 'AT', 'BM', 'BA', 'RU'],
      total: {
        'all': schema.tickets.all().length,
        'new': 12,
        'in-progress': 143,
        'pending': 3,
        'closed': 20,
        'cancelled':42,
        'past-deadline': 80,
        'open': 42,
        'resolved': 66
      },
      startDate: '2017-09-01T00:00:00.000Z',
      endDate: '2017-12-01T00:00:00.000Z'
    };

    return schema.ticketStats.where(filters);
  });
}
