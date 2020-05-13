import { Factory } from 'ember-cli-mirage';

import faker from 'faker';

export default Factory.extend({
  createdAt()     { return faker.date.past(); },
  updatedAt()     { return faker.date.past(); },
});
