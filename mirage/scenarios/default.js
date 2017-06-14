export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.

    Make sure to define a factory for each model you want to create.
  */

  // mirror GET /me
  server.create('user', {
    id: 42,
    email: "user@mail.com",
    firstName: 'John',
    lastName: 'Appleseed',
    isStaff: true,
    isSuperuser: true
  });

  server.createList('user', 7);
  server.createList('user', 5, 'staff');
  server.createList('user', 2, 'superuser');

  server.createList('ticket', 3, 'isPerson', 'withActivities', {
    status: 'new',
  });
  server.createList('ticket', 3, 'isPerson', 'withResponder', 'withComments', {
    status: 'in-progress',
  });

  server.createList('ticket', 3, 'isPerson', 'withResponder', 'withComments', {
    status: 'closed',
  });
  server.createList('ticket', 3, 'isPerson', 'withResponder', 'withComments', {
    status: 'cancelled',
  });

  server.createList('ticket', 3, 'isCompany', 'withComments', {
    status: 'new',
  });
  server.createList('ticket', 3, 'isOther', 'withComments', {
    status: 'new',
  });

  // Just for pagination
  server.createList('ticket', 20, 'isPerson');
}
