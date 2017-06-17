import { Factory, faker, trait } from 'ember-cli-mirage';

const random = faker.random.arrayElement;

export default Factory.extend({
  createdAt() { return faker.date.past(); },

  isComment: trait({
    verb: 'comment',

    afterCreate(activity, server) {
      let regulars = server.schema.users.where({ isStaff: false });

      let comment = server.create('comment', { ticket: activity.ticket });

      activity.update({
        user: random(regulars.models),
        comment
      });
    }
  }),

  isCancel: trait({
    verb: 'status_cancelled',

    afterCreate(activity, server) {
      let regulars = server.schema.users.where({ isStaff: false });

      activity.update({
        user: random(regulars.models)
      });
    }
  }),

  isClose: trait({
    verb: 'status_closed',

    afterCreate(activity, server) {
      let staff = server.schema.users.where({ isStaff: true });

      activity.update({
        user: random(staff.models)
      });
    }
  }),

  isReopen: trait({
    verb: 'status_new',

    afterCreate(activity, server) {
      let regulars = server.schema.users.where({ isStaff: false });

      let comment = server.create('comment', { ticket: activity.ticket });

      activity.update({
        user: random(regulars.models),
        comment
      });
    }
  })
});
