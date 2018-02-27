import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view - responders');

test('(admin) assign responders to the ticket', async function(assert) {
  assert.expect(6);

  server.createList('profile', 5, {
    firstName(i) { return `Staff #${i+1}`; },
    lastName: 'Doe',
    isStaff: true
  });

  initSession({ isSuperuser: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  let done = assert.async();
  server.post('/responders', function (schema, request) {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs, {
      "data": {
        "attributes": {
          "created-at": null,
          "updated-at": null
        },
        "relationships": {
          "ticket": {
            "data": {
              "id": `${ticket.id}`,
              "type": "tickets"
            }
          },
          "user": {
            "data": {
              "id": "3",
              "type": "profiles"
            }
          }
        },
        "type": "responders"
      }
    });

    done();

    ticket.update('status', 'in-progress');
    return schema.responders.create(this.normalizedRequestAttrs());
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'initial status');
  assert.equal(find('[data-test-responder]').length, 0);

  let $ddTrigger = find('[data-test-dd="assign-responder"] [data-test-dd-trigger]');

  await click($ddTrigger);
  await fillIn('[data-test-filter-search]', 'Staff #3');
  await click('[data-test-search-result]:first');

  let $responders = find('[data-test-responder]');
  assert.equal($responders.length, 1);
  assert.equal($responders.filter(':first').find('[data-test-el-item]').text().trim(), 'Staff #3 Doe', 'user is assigned');

  assert.equal(find('[data-test-status]').text().trim(), 'In progress', 'status changes to in-progress after first assignment');
});


test('(admin) if assigning responders errors, a message is displayed', async function(assert) {
  assert.expect(3);

  server.createList('profile', 5, {
    firstName(i) { return `Staff #${i+1}`; },
    lastName: 'Doe',
    isStaff: true
  });

  initSession({ isSuperuser: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership'
  });

  server.post('/responders', {
    errors: [{ detail: "Unable to add responder." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-responder]').length, 0);

  let $ddTrigger = find('[data-test-dd="assign-responder"] [data-test-dd-trigger]');

  await click($ddTrigger);
  await fillIn('[data-test-filter-search]', 'Staff #3');
  await click('[data-test-search-result]:first');

  assert.equal(find('[data-test-responder]').length, 0);
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('(admin) remove responders from ticket', async function(assert) {
  assert.expect(5);

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  let profiles = server.createList('profile', 3, {
    id(i) { return 10 + i },
    firstName(i) { return `Staff #${10 + i}`; },
    lastName: 'Doe',
    isStaff: true
  });

  profiles.forEach(profile => {
    server.create('responder', {
      id(i) { return 20 + i },
      ticket,
      user: profile
    });
  })

  initSession({ isSuperuser: true });

  let done = assert.async();
  server.del('/responders/:id', function (schema, request) {
    assert.equal(request.params.id, 21);
    done();

    schema.responders.find(request.params.id).destroy();
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-responder]').length, 3);

  let $target = find('[data-test-responder=11]');
  assert.equal($target.find('[data-test-el-item]').text().trim(), 'Staff #11 Doe', 'target user is assigned');

  await click($target.find('[data-test-el-remove]'));

  assert.equal(find('[data-test-responder]').length, 2);
  assert.equal(find('[data-test-responder=11]').length, 0, 'target user is unassigned');
});


test('(admin) if removing responders errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession({ isSuperuser: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  let profile = server.create('profile', {
    isStaff: true
  });

  server.create('responder', {
    ticket,
    user: profile
  });

  server.del('/responders/:id', {
    errors: [{ detail: "Unable to delete responder." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  let $target = find('[data-test-responder]');
  assert.equal($target.length, 1);

  await click($target.find('[data-test-el-remove]'));

  assert.equal(find('[data-test-responder]').length, 1, 'user remains assigned');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('current user can unassign self from ticket', async function(assert) {
  assert.expect(3);

  // this can only happen if the current user is a staff member
  // but the UI element doesn't check against that
  let currentUser = initSession();

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'company_ownership',
  });

  server.create('responder', {
    ticket,
    user: currentUser
  });

  let done = assert.async();
  server.del('/responders/:id', function (schema, request) {
    done();
    schema.responders.find(request.params.id).destroy();
  });

  await visit(`/view/${ticket.id}`);

  let $responders = find('[data-test-responder]');
  assert.equal($responders.length, 1);
  assert.equal($responders.filter(':first').text().trim(), 'John Appleseed', 'current user is assigned');

  await click('[data-test-unassign-self]');

  assert.equal(find('[data-test-responder]').length, 0);
});