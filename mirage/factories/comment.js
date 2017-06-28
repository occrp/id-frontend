import { Factory, faker } from 'ember-cli-mirage';

const random = faker.random.arrayElement;

export default Factory.extend({
  createdAt() { return faker.date.past(); },
  body() { return faker.lorem.sentences(); },

  afterCreate(comment, server) {
    let regulars = server.schema.profiles.where({ isStaff: false });

    comment.update({
      user: random(regulars.models)
    });
  }
});
