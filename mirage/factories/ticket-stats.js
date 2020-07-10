import { Factory } from 'ember-cli-mirage';
import { statusList } from 'id-frontend/models/ticket';
import faker from 'faker';

export default Factory.extend({
  count()        { return faker.random.number(10); },
  status()       { return faker.random.arrayElement(statusList); },
  avgTime()      { return faker.random.number(100); },
  pastDeadline() { return faker.random.number(10); },
  country()      { return faker.address.countryCode(); }
});
