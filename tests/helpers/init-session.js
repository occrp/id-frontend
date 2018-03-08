import { registerHelper } from '@ember/test';

export default registerHelper('initSession', function(app, overrides = {}) {
  return server.create('profile', Object.assign({
    id: 42,
    email: "user@mail.com",
    firstName: 'John',
    lastName: 'Appleseed',
    isStaff: false,
    isSuperuser: false
  }, overrides));
});
