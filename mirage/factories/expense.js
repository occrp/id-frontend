import { Factory, faker } from 'ember-cli-mirage';

const random = faker.random.arrayElement;

export default Factory.extend({
  scope()     { return faker.lorem.sentence(); },
  amount()    { return random([0, faker.finance.amount()]); },
  rating()    { return random([0, 1, 3]); },
  notes()     { return faker.lorem.sentences(); },
  paymentMethod() { return faker.finance.transactionType(); },
  createdAt() { return faker.date.past(); },
  updatedAt() { return faker.date.past(); },

  afterCreate(expense, server) {
    let regulars = server.schema.profiles.where({ isStaff: false });

    expense.update({
      user: random(regulars.models)
    });
  }
});
