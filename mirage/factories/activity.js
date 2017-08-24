import { Factory, faker, trait } from 'ember-cli-mirage';

const random = faker.random.arrayElement;

export default Factory.extend({
  createdAt() { return faker.date.past(); },

  isComment: trait({
    verb: 'comment:create',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });

      let comment = server.create('comment', { ticket: activity.ticket });

      activity.update({
        user: random(regulars.models),
        comment
      });
    }
  }),

  isCancel: trait({
    verb: 'ticket:update:status_cancelled',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });

      activity.update({
        user: random(regulars.models)
      });
    }
  }),

  isClose: trait({
    verb: 'ticket:update:status_closed',

    afterCreate(activity, server) {
      let staff = server.schema.profiles.where({ isStaff: true });

      activity.update({
        user: random(staff.models)
      });
    }
  }),

  isReopen: trait({
    verb: 'ticket:update:reopen',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });

      let comment = server.create('comment', { ticket: activity.ticket });

      activity.update({
        user: random(regulars.models),
        comment
      });
    }
  }),

  isPending: trait({
    verb: 'ticket:update:pending',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });

      let comment = server.create('comment', { ticket: activity.ticket });

      activity.update({
        user: random(regulars.models),
        comment
      });
    }
  }),

  isResume: trait({
    verb: 'ticket:update:status_in-progress',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });

      activity.update({
        user: random(regulars.models)
      });
    }
  }),

  isAttachment: trait({
    verb: 'attachment:create',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });

      let attachment = server.create('attachment', { ticket: activity.ticket });

      activity.update({
        user: random(regulars.models),
        attachment
      });
    }
  }),

  isAssignment: trait({
    verb: 'responder:create',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });
      let pick = random(regulars.models);

      server.create('responder', {
        ticket: activity.ticket,
        user: pick
      });

      activity.update({
        responderUser: pick
      });
    }
  }),

  isUnassignment: trait({
    verb: 'responder:destroy',

    afterCreate(activity, server) {
      let regulars = server.schema.profiles.where({ isStaff: false });
      let pick = random(regulars.models);

      activity.update({
        responderUser: pick
      });
    }
  })
});
