export function initSession(overrides = {}) {
  return server.create('profile', Object.assign({
    id: 42,
    email: "user@mail.com",
    firstName: 'John',
    lastName: 'Appleseed',
    isStaff: false,
    isSuperuser: false
  }, overrides));
}