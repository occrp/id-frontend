import { Factory, trait } from 'ember-cli-mirage';

import faker from 'faker';

export default Factory.extend({
  firstName()     { return faker.name.firstName(); },
  lastName()      { return faker.name.lastName(); },
  email()         { return faker.internet.email(); },
  bio()           { return faker.company.bs(); },
  isStaff()       { return false; },
  isSuperuser()   { return false; },
  ticketsCount()  { return faker.random.number(100); },

  staff: trait({
    isStaff: true,
    email(i) { return `staffmail${i}@mail.com`; }
  }),
  superuser: trait({
    isStaff: true,
    isSuperuser: true
  }),

});
