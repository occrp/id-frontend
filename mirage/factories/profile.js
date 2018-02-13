import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  firstName()     { return faker.name.firstName(); },
  lastName()      { return faker.name.lastName(); },
  email()         { return faker.internet.email(); },
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
