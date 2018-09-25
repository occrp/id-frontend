import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  email()         { return faker.internet.email(); },
  createdAt()     { return faker.date.past(); },
  updatedAt()     { return faker.date.past(); },
});
