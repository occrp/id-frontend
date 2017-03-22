export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.

    Make sure to define a factory for each model you want to create.
  */

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
  server.createList('ticket', 5, 'withUserRels', 'withComments', {
    type: 'person_ownership',
    status: 'new',
    name: 'John',
    surname(i) { return `Doe ${i+1}`; }
  });
  server.createList('ticket', 130, 'withUserRels');
}
