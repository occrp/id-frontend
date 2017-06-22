import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  createdAt()     { return faker.date.past(); },
  updatedAt()     { return faker.date.past(); },
});
