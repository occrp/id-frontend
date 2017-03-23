import { Factory, faker, trait } from 'ember-cli-mirage';
import { typeList, statusList } from 'id2-frontend/models/ticket';

const random = faker.random.arrayElement;
const t = typeList.length;

const paragraphs = `Labore deserunt beatae et et. Expedita autem maiores. Nobis molestiae explicabo aliquam architecto at mollitia.

Voluptatum doloremque exercitationem beatae est. Est laboriosam libero autem dolores asperiores maiores veritatis. Libero exercitationem totam sit sequi veritatis. Quae et et aut dolor nesciunt. Et veritatis totam. Perferendis quidem magni mollitia molestias quis ut iure.

Quia ducimus alias laborum consequuntur rerum. Reiciendis nobis quod temporibus velit in culpa tenetur. Consectetur eos harum. Totam soluta tempore vel ipsum consequuntur voluptas quia ipsa. Velit architecto tenetur dolor aut hic sed error illo. Labore quis pariatur omnis magnam explicabo.`;

export default Factory.extend({
  type(i)                 { return typeList[i % t]; },
  created()               { return faker.date.past(); },
  status()                { return statusList[0]; },
  statusUpdated()         { return faker.date.past(); },

  sensitive(i)            { return i % 2 === 0 ? true : false; },
  whySensitive()          { return faker.lorem.sentences(); },
  deadline()              { return faker.date.future(); },

  isPerson: trait({
    type:                 typeList[0],
    name()                { return faker.name.firstName(); },
    surname()             { return faker.name.lastName(); },
    aliases()             { return faker.lorem.sentences(); },
    dob()                 { return faker.date.past(); },
    family()              { return faker.lorem.sentences(); },
    background()          { return paragraphs; },
    businessActivities()  { return faker.lorem.sentences(); },
    initialInformation()  { return faker.lorem.sentences(); }
  }),

  isCompany: trait({
    type:                 typeList[1],
    companyName()         { return faker.company.companyName(); },
    country()             { return faker.address.countryCode(); },
    companyBackground()   { return faker.lorem.sentences(); },
    connections()         { return faker.lorem.sentences(); },
    sources()             { return faker.lorem.sentences(); }
  }),

  isOther: trait({
    type:                 typeList[2],
    question()            { return faker.lorem.paragraphs(); }
  }),

  afterCreate(ticket, server) {
    let regulars = server.schema.users.where({ isStaff: false });

    ticket.update({
      author: random(regulars.models),
    });
  },

  withAsignee: trait({
    afterCreate(ticket, server) {
      let staff = server.schema.users.where({ isStaff: true });

      ticket.update({
        assignee: random(staff.models)
      });
    }
  }),

  withComments: trait({
    afterCreate(ticket, server) {
      server.createList('activity', 3, 'isComment', { ticket });
    }
  }),

  withActivities: trait({
    afterCreate(ticket, server) {
      server.createList('activity', 2, 'isComment', { ticket });
      server.create('activity', 'isCancel', { ticket });
      server.create('activity', 'isReopen', { ticket });
      server.create('activity', 'isComment', { ticket });
      server.create('activity', 'isClose', { ticket });
    }
  })

});
