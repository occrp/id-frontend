import { Factory } from 'ember-cli-mirage';

import faker from 'faker';

const random = faker.random.arrayElement;

export default Factory.extend({
  rating()    { return random([0, 1, 2, 3]); },
  link()      { return faker.lorem.sentences(); },
  body()      { return faker.lorem.sentences(); },
  createdAt() { return faker.date.past(); }
});
