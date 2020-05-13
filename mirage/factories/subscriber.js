import { Factory } from 'ember-cli-mirage';

import faker from 'faker';

export default Factory.extend({
  email()         { return faker.internet.email(); },
  createdAt()     { return faker.date.past(); },
  updatedAt()     { return faker.date.past(); },
});
