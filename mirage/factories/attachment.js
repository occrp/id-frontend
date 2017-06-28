import { Factory, faker } from 'ember-cli-mirage';

const random = faker.random.arrayElement;

export default Factory.extend({
  url()           { return faker.image.image(); },
  fileName()      { return faker.system.commonFileName(); },
  fileSize()      { return faker.random.number(); },
  mimeType()      { return faker.system.mimeType(); },

  createdAt()     { return faker.date.past(); },
  updatedAt()     { return faker.date.past(); },

  afterCreate(attachment, server) {
    let regulars = server.schema.profiles.where({ isStaff: false });

    attachment.update({
      user: random(regulars.models)
    });
  }
});
