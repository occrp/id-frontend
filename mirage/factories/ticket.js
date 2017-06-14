import { Factory, faker, trait } from 'ember-cli-mirage';
import { kindList, statusList } from 'id2-frontend/models/ticket';

const random = faker.random.arrayElement;
const t = kindList.length;

const paragraphs = `Labore deserunt beatae et et. Expedita autem maiores. Nobis molestiae explicabo aliquam architecto at mollitia.

Voluptatum doloremque exercitationem beatae est. Est laboriosam libero autem dolores asperiores maiores veritatis. Libero exercitationem totam sit sequi veritatis. Quae et et aut dolor nesciunt. Et veritatis totam. Perferendis quidem magni mollitia molestias quis ut iure.

Quia ducimus alias laborum consequuntur rerum. Reiciendis nobis quod temporibus velit in culpa tenetur. Consectetur eos harum. Totam soluta tempore vel ipsum consequuntur voluptas quia ipsa. Velit architecto tenetur dolor aut hic sed error illo. Labore quis pariatur omnis magnam explicabo.`;

export default Factory.extend({
  kind(i)                 { return kindList[i % t]; },
  status()                { return statusList[0]; },
  createdAt()             { return faker.date.past(); },
  updatedAt()             { return faker.date.past(); },
  deadlineAt()            { return faker.date.future(); },

  sensitive(i)            { return i % 2 === 0 ? true : false; },
  whySensitive()          { return faker.lorem.sentences(); },

  // Attributes based on type. Override with traits
  firstName:              null,
  lastName:               null,
  aliases:                null,
  bornAt:                 null,
  family:                 null,
  background:             null,
  businessActivities:     null,
  initialInformation:     null,

  companyName:            null,
  country:                null,
  companyBackground:      null,
  connections:            null,
  sources:                null,

  question:               null,

  isPerson: trait({
    kind:                 kindList[0],
    firstName()           { return faker.name.firstName(); },
    lastName()            { return faker.name.lastName(); },
    aliases()             { return faker.lorem.sentences(); },
    bornAt()              { return faker.date.past(); },
    family()              { return faker.lorem.sentences(); },
    background()          { return paragraphs; },
    businessActivities()  { return faker.lorem.sentences(); },
    initialInformation()  { return faker.lorem.sentences(); }
  }),

  isCompany: trait({
    kind:                 kindList[1],
    companyName()         { return faker.company.companyName(); },
    country()             { return faker.address.countryCode(); },
    companyBackground()   { return faker.lorem.sentences(); },
    connections()         { return faker.lorem.sentences(); },
    sources()             { return faker.lorem.sentences(); }
  }),

  isOther: trait({
    kind:                 kindList[2],
    question()            { return faker.lorem.paragraphs(); }
  }),

  afterCreate(ticket, server) {
    let regulars = server.schema.users.where({ isStaff: false });

    ticket.update({
      requester: random(regulars.models),
    });
  },

  withResponder: trait({
    afterCreate(ticket, server) {
      let staff = server.schema.users.where({ isStaff: true });

      ticket.update({
        responder: random(staff.models)
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
