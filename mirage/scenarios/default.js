import moment from 'moment';

export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.

    Make sure to define a factory for each model you want to create.
  */

  // mirror GET /me
  server.create('profile', {
    id: 42,
    email: "user@mail.com",
    firstName: 'John',
    lastName: 'Appleseed',
    isStaff: true,
    isSuperuser: true,
    ticketsCount: 72
  });

  server.createList('profile', 7);
  server.createList('profile', 4, 'staff');
  server.create('profile', 'staff', {
    firstName: null,
    lastName: null
  });
  server.createList('profile', 2, 'superuser');

  server.createList('ticket', 1, 'isPerson', 'withActivities', 'withAttachments', {
    status: 'new',
  });
  server.createList('ticket', 1, 'isPerson', 'withResponder', 'withSubscriber', 'withComments', 'withExpenses', {
    status: 'in-progress',
  });
  server.create('ticket', 'isPerson', 'withComments', 'withExpenses', {
    status: 'pending',
  });

  server.createList('ticket', 2, 'isPerson', 'withResponder', {
    status: 'closed',
  });
  server.createList('ticket', 2, 'isPerson', 'withResponder', {
    status: 'cancelled',
  });

  server.createList('ticket', 2, 'isCompany', {
    status: 'new',
  });

  server.createList('ticket', 2, 'isVehicle', {
    status: 'new',
  });

  server.createList('ticket', 2, 'isData', {
    status: 'new',
  });

  server.createList('ticket', 30, 'isOther', {
    status: 'new',
  });

  server.createList('ticket-stats', 4, {
    status: 'new',
    date(i) {
      return moment.utc().startOf('month').subtract(i % 4, 'months').toISOString();
    },
    profileId: 52
  });
  server.createList('ticket-stats', 4, {
    status: 'in-progress',
    date(i) {
      return moment.utc().startOf('month').subtract(i % 4, 'months').toISOString();
    },
    profileId: 52
  });
  server.createList('ticket-stats', 4, {
    status: 'closed',
    date(i) {
      return moment.utc().startOf('month').subtract(i % 4, 'months').toISOString();
    },
    profileId: 53
  });
  server.createList('ticket-stats', 4, {
    status: 'cancelled',
    date(i) {
      return moment.utc().startOf('month').subtract(i % 4, 'months').toISOString();
    },
    profileId: 51
  });

}
