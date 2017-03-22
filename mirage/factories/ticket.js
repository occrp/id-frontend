import { Factory, faker, trait } from 'ember-cli-mirage';
import { typeList, statusList } from 'id2-frontend/models/ticket';

const random = faker.random.arrayElement;
const t = typeList.length;

const paragraphs = `Labore deserunt beatae et et. Expedita autem maiores. Nobis molestiae explicabo aliquam architecto at mollitia.

Voluptatum doloremque exercitationem beatae est. Est laboriosam libero autem dolores asperiores maiores veritatis. Libero exercitationem totam sit sequi veritatis. Quae et et aut dolor nesciunt. Et veritatis totam. Perferendis quidem magni mollitia molestias quis ut iure.

Quia ducimus alias laborum consequuntur rerum. Reiciendis nobis quod temporibus velit in culpa tenetur. Consectetur eos harum. Totam soluta tempore vel ipsum consequuntur voluptas quia ipsa. Velit architecto tenetur dolor aut hic sed error illo. Labore quis pariatur omnis magnam explicabo.`;

export default Factory.extend({
  type(i)               { return typeList[i % t]; },
  created()             { return faker.date.past(); },
  status(i)             { return i > 5 ? random(statusList) : 'new'; },
  statusUpdated()       { return faker.date.past(); },

  sensitive(i)          { return i % 2 === 0 ? true : false; },
  whySensitive()        { return faker.lorem.sentences(); },
  deadline()            { return faker.date.future(); },

  name(i)               { return i%t+1 === 1 ? faker.name.firstName() : null; },
  surname(i)            { return i%t+1 === 1 ? faker.name.lastName() : null; },
  aliases(i)            { return i%t+1 === 1 ? faker.lorem.sentences() : null; },
  dob(i)                { return i%t+1 === 1 ? faker.date.past() : null; },
  family(i)             { return i%t+1 === 1 ? faker.lorem.sentences() : null; },
  background(i)         { return i%t+1 === 1 ? paragraphs : null; },
  businessActivities(i) { return i%t+1 === 1 ? faker.lorem.sentences() : null; },
  initialInformation(i) { return i%t+1 === 1 ? faker.lorem.sentences() : null; },

  companyName(i)        { return i%t+1 === 2 ? faker.company.companyName() : null; },
  country(i)            { return i%t+1 === 2 ? faker.address.countryCode() : null; },
  companyBackground(i)  { return i%t+1 === 2 ? faker.lorem.sentences() : null; },
  connections(i)        { return i%t+1 === 2 ? faker.lorem.sentences() : null; },
  sources(i)            { return i%t+1 === 2 ? faker.lorem.sentences() : null; },

  question(i)           { return i%t+1 === 3 ? faker.lorem.paragraphs() : null; },

  withUserRels: trait({
    afterCreate(ticket, server) {
      let regulars = server.schema.users.where({ isStaff: false });
      let staff = server.schema.users.where({ isStaff: true });

      let hash = {
        author: random(regulars.models),
        assignee: ticket.status === 'new' ? null : random(staff.models)
      };

      ticket.update(hash);
    }
  }),

  withComments: trait({
    afterCreate(ticket, server) {
      server.createList('activity', 3, 'isComment', { ticket });
    }
  })

});
