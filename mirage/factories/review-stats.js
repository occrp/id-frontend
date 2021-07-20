import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  count()        { return faker.random.number(10); },
  ratings()      { return faker.random.number(10); }
});
