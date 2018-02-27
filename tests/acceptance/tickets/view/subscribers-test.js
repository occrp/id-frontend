import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view - subscribers');

test('(staff) add subscribers to the ticket', async function(assert) {
  assert.expect(5);

  initSession({ isStaff: true });

  server.create('profile', {
    id: 10,
    firstName: 'Subscriber',
    lastName: 'Doe',
    email: 'sub@mail.com'
  });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  let done = assert.async();
  server.post('/subscribers', function (schema, request) {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs, {
      "data": {
        "attributes": {
          "created-at": null,
          "updated-at": null,
          "user-email": "sub@mail.com"
        },
        "relationships": {
          "ticket": {
            "data": {
              "id": `${ticket.id}`,
              "type": "tickets"
            }
          }
        },
        "type": "subscribers"
      }
    });

    done();

    let profile = schema.profiles.findBy({ email: attrs.data.attributes['user-email'] });

    return schema.subscribers.create(Object.assign(this.normalizedRequestAttrs(), {
      user: profile
    }));
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-subscriber]').length, 0);

  await fillIn('#subscriber-email', 'this.is.not.an.email');
  await click('[data-test-add-subscriber]');
  assert.ok(find('#subscriber-email').closest('.formGroup').hasClass('is-invalid'), 'invalid email shows error');

  await fillIn('#subscriber-email', 'sub@mail.com');
  await click('[data-test-add-subscriber]');

  assert.equal(find('[data-test-subscriber]').length, 1);
  assert.equal(find('[data-test-subscriber=10] [data-test-el-item]').text().trim(), 'Subscriber Doe', 'user is subscribed');
});


test('(staff) if adding subscribers errors, a message is displayed', async function(assert) {
  assert.expect(3);

  initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  server.post('/subscribers', {
    errors: [{ detail: "Unable to add subscriber." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-subscriber]').length, 0);

  await fillIn('#subscriber-email', 'sub@mail.com');
  await click('[data-test-add-subscriber]');

  assert.equal(find('[data-test-subscriber]').length, 0);
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('(staff) remove subscribers from ticket', async function(assert) {
  assert.expect(5);

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  let profiles = server.createList('profile', 3, {
    id(i) { return 10 + i },
    firstName(i) { return `John #${10 + i}`; },
    lastName: 'Doe',
  });

  profiles.forEach(profile => {
    server.create('subscriber', {
      id(i) { return 20 + i },
      ticket,
      user: profile
    });
  })

  initSession({ isStaff: true });

  let done = assert.async();
  server.del('/subscribers/:id', function (schema, request) {
    assert.equal(request.params.id, 21);
    done();

    schema.subscribers.find(request.params.id).destroy();
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-subscriber]').length, 3);

  let $target = find('[data-test-subscriber=11]');
  assert.equal($target.find('[data-test-el-item]').text().trim(), 'John #11 Doe', 'target user is subscribed');
  await click($target.find('[data-test-el-remove]'));

  assert.equal(find('[data-test-subscriber]').length, 2);
  assert.equal(find('[data-test-subscriber=11]').length, 0, 'target user is unsubscribed');
});


test('(staff) if unsubscribing users errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  server.create('subscriber', {
    ticket,
    user: server.create('profile')
  });

  server.del('/subscribers/:id', {
    errors: [{ detail: "Unable to unsubscribe user." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  let $target = find('[data-test-subscriber]');
  assert.equal($target.length, 1);

  await click($target.find('[data-test-el-remove]'));

  assert.equal(find('[data-test-subscriber]').length, 1, 'user remains subscribed');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('current user can unsubscribe from ticket', async function(assert) {
  assert.expect(1);
  let currentUser = initSession();

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  server.create('subscriber', {
    ticket,
    user: currentUser
  });

  let done = assert.async();
  server.del('/subscribers/:id', function (schema, request) {
    done();
    schema.subscribers.find(request.params.id).destroy();
  });

  await visit(`/view/${ticket.id}`);

  findWithAssert('[data-test-unsubscribe-self]');
  await click('[data-test-unsubscribe-self]');

  assert.equal(find('[data-test-unsubscribe-self]').length, 0);
});