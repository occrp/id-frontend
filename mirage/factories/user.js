import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  firstName()     { return faker.name.firstName(); },
  lastName()      { return faker.name.lastName(); },
  email()         { return faker.internet.email(); },
  isStaff()       { return false; },
  isSuperuser()   { return false; },

  staff: trait({
    isStaff: true
  }),
  superuser: trait({
    isStaff: true,
    isSuperuser: true
  }),

});