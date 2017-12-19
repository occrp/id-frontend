import { Factory, faker, trait } from 'ember-cli-mirage';
import { kindList, statusList } from 'id-frontend/models/ticket';

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
  whysensitive()          { return faker.lorem.sentences(); },
  background()            { return paragraphs; },

  // Attributes based on kind. Override with traits
  firstName:              null,
  lastName:               null,
  initialInformation:     null,
  bornAt:                 null,
  businessActivities:     null,

  companyName:            null,
  country:                null,
  sources:                null,
  connections:            null,

  isPerson: trait({
    kind:                 kindList[0],
    firstName()           { return faker.name.firstName(); },
    lastName()            { return faker.name.lastName(); },
    country()             { return faker.address.countryCode(); },
    initialInformation()  { return faker.lorem.sentences(); },
    bornAt()              { return faker.date.past(); },
    sources()             { return faker.lorem.sentences(); },
    connections()         { return faker.lorem.sentences(); },
    businessActivities()  { return faker.lorem.sentences(); }
  }),

  isCompany: trait({
    kind:                 kindList[1],
    companyName()         { return faker.company.companyName(); },
    country()             { return faker.address.countryCode(); },
    sources()             { return faker.lorem.sentences(); },
    connections()         { return faker.lorem.sentences(); }
  }),

  isOther: trait({
    kind:                 kindList[2],
  }),

  afterCreate(ticket, server) {
    let regulars = server.schema.profiles.where({ isStaff: false });

    ticket.update({
      requester: random(regulars.models),
    });
  },

  withResponder: trait({
    afterCreate(ticket, server) {
      let staff = server.schema.profiles.where({ isStaff: true });

      server.createList('responder', 3, {
        ticket,
        user() { return random(staff.models); }
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
      server.create('activity', 'isPending', { ticket });
      server.create('activity', 'isResume', { ticket });
      server.create('activity', 'isComment', { ticket });
      server.create('activity', 'isClose', { ticket });
      server.create('activity', 'isAttachment', { ticket });
      server.create('activity', 'isAssignment', { ticket });
      server.create('activity', 'isUnassignment', { ticket });
      server.create('activity', 'isAttachmentRemoval', { ticket });
    }
  }),

  withAttachments: trait({
    afterCreate(ticket, server) {
      server.createList('attachment', 3, { ticket });
    }
  }),


});
