import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  userEmail()     { return faker.internet.email(); },
  createdAt()     { return faker.date.past(); },
  updatedAt()     { return faker.date.past(); },
});
