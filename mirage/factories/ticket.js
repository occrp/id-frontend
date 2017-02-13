import { Factory, faker } from 'ember-cli-mirage';
import { typeList, statusList } from 'id2-frontend/models/ticket';

const t = typeList.length;

export default Factory.extend({
  type(i)               { return typeList[i % t]; },
  created()             { return faker.date.past(); },
  status(i)             { return statusList[i % statusList.length]; },
  statusUpdated()       { return faker.date.past(); },

  sensitive(i)          { return i % 2 === 0 ? true : false; },
  whySensitive()        { return faker.lorem.sentences(); },
  deadline()            { return faker.date.future(); },

  name(i)               { return i%t+1 === 1 ? faker.name.firstName() : null; },
  surname(i)            { return i%t+1 === 1 ? faker.name.lastName() : null; },
  aliases(i)            { return i%t+1 === 1 ? faker.lorem.paragraphs() : null; },
  dob(i)                { return i%t+1 === 1 ? faker.date.past() : null; },
  family(i)             { return i%t+1 === 1 ? faker.lorem.sentences() : null; },
  background(i)         { return i%t+1 === 1 ? faker.lorem.sentences() : null; },
  businessActivities(i) { return i%t+1 === 1 ? faker.lorem.sentences() : null; },
  initialInformation(i) { return i%t+1 === 1 ? faker.lorem.sentences() : null; },

  companyName(i)        { return i%t+1 === 2 ? faker.company.companyName() : null; },
  country(i)            { return i%t+1 === 2 ? faker.address.countryCode() : null; },
  companyBackground(i)  { return i%t+1 === 2 ? faker.lorem.sentences() : null; },
  connections(i)        { return i%t+1 === 2 ? faker.lorem.sentences() : null; },
  sources(i)            { return i%t+1 === 2 ? faker.lorem.sentences() : null; },

  question(i)           { return i%t+1 === 3 ? faker.lorem.sentences() : null; }
});
