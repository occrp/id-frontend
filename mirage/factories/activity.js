import { Factory, faker, trait } from 'ember-cli-mirage';
import { typeList } from 'id2-frontend/models/activity';

const random = faker.random.arrayElement;

export default Factory.extend({
  created() { return faker.date.past(); },

  isComment: trait({
    type: 'update',
    comment() { return faker.lorem.sentences(); },

    afterCreate(activity, server) {
      let regulars = server.schema.users.where({ isStaff: false });

      activity.update({
        author: random(regulars.models)
      });
    }
  }),

  isCancel: trait({
    type: 'cancel',

    afterCreate(activity, server) {
      let regulars = server.schema.users.where({ isStaff: false });

      activity.update({
        author: random(regulars.models)
      });
    }
  }),

  isClose: trait({
    type: 'close',

    afterCreate(activity, server) {
      let staff = server.schema.users.where({ isStaff: true });

      activity.update({
        author: random(staff.models)
      });
    }
  }),

  isReopen: trait({
    type: 'reopen',
    comment() { return faker.lorem.sentences(); },

    afterCreate(activity, server) {
      let regulars = server.schema.users.where({ isStaff: false });

      activity.update({
        author: random(regulars.models)
      });
    }
  })
});
