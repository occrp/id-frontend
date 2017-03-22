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
  })
});
