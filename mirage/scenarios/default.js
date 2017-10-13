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
    ticketCount: 10
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
  server.createList('ticket', 1, 'isPerson', 'withResponder', 'withComments', {
    status: 'in-progress',
  });
  server.create('ticket', 'isPerson', 'withComments', {
    status: 'pending',
  });

  server.createList('ticket', 3, 'isPerson', 'withResponder', {
    status: 'closed',
  });
  server.createList('ticket', 3, 'isPerson', 'withResponder', {
    status: 'cancelled',
  });

  server.createList('ticket', 3, 'isCompany', {
    status: 'new',
  });
  server.createList('ticket', 3, 'isOther', {
    status: 'new',
  });

  // Just for pagination
  server.createList('ticket', 20, 'isPerson');
}
