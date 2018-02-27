import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view - status changes');

test('cancelling a ticket', async function(assert) {
  assert.expect(7);
  let currentUser = initSession();

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'person_ownership',
    firstName: 'John',
    lastName: 'Doe',
    background: 'Lorem ipsum some background.',
    initialInformation: 'Initial info',
    sources: 'Aliases',
    connections: 'Family',
    businessActivities: 'Bizniss',
    sensitive: false,
    whysensitive: null,
    bornAt: '2004-12-01T22:00:00.000Z',
    createdAt: '2016-12-01T22:00:00.000Z',
    deadlineAt: '2018-12-01T22:00:00.000Z',
    updatedAt: '2017-01-01T22:00:00.000Z'
  });

  let done = assert.async();
  server.patch('/tickets/:id', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs.data.attributes, {
      "background": "Lorem ipsum some background.",
      "business-activities": "Bizniss",
      "company-name": null,
      "connections": "Family",
      "country": null,
      "created-at": "2016-12-01T22:00:00.000Z",
      "deadline-at": "2018-12-01T22:00:00.000Z",
      "born-at": "2004-12-01T22:00:00.000Z",
      "initial-information": "Initial info",
      "first-name": "John",
      "sensitive": false,
      "sources": "Aliases",
      "status": "cancelled",
      "updated-at": "2017-01-01T22:00:00.000Z",
      "last-name": "Doe",
      "kind": "person_ownership",
      "whysensitive": null,
      "pending-reason": null,
      "reopen-reason": null
    });

    done();

    server.create('activity', {
      verb: `ticket:update:status_cancelled`,
      ticket,
      user: currentUser
    });

    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'initial status');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity]').length, 0);

  await click('[data-test-cancel]');
  findWithAssert('.modal');
  await click('[data-test-modal-confirmCancel]');

  assert.equal(find('[data-test-status]').text().trim(), 'Cancelled', 'status changed to cancelled');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity=cancel]').length, 1, 'new activity is rendered');
});


test('if cancelling a ticket errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession();

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'person_ownership',
  });

  server.patch('/tickets/:id', {
    errors: [{ detail: "Unable to cancel ticket." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'initial status');

  await click('[data-test-cancel]');
  await click('[data-test-modal-confirmCancel]');

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'status is rolled back');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('(staff) closing a ticket', async function(assert) {
  assert.expect(7);
  let currentUser = initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'person_ownership',
    firstName: 'John',
    lastName: 'Doe',
    background: 'Lorem ipsum some background.',
    initialInformation: 'Initial info',
    sources: 'Aliases',
    connections: 'Family',
    businessActivities: 'Bizniss',
    sensitive: false,
    whysensitive: null,
    bornAt: '2004-12-01T22:00:00.000Z',
    createdAt: '2016-12-01T22:00:00.000Z',
    deadlineAt: '2018-12-01T22:00:00.000Z',
    updatedAt: '2017-01-01T22:00:00.000Z',
  });

  let done = assert.async();
  server.patch('/tickets/:id', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs.data.attributes, {
      "background": "Lorem ipsum some background.",
      "business-activities": "Bizniss",
      "company-name": null,
      "connections": "Family",
      "country": null,
      "created-at": "2016-12-01T22:00:00.000Z",
      "deadline-at": "2018-12-01T22:00:00.000Z",
      "born-at": "2004-12-01T22:00:00.000Z",
      "initial-information": "Initial info",
      "first-name": "John",
      "sensitive": false,
      "sources": "Aliases",
      "status": "closed",
      "updated-at": "2017-01-01T22:00:00.000Z",
      "last-name": "Doe",
      "kind": "person_ownership",
      "whysensitive": null,
      "pending-reason": null,
      "reopen-reason": null
    });

    done();

    server.create('activity', {
      verb: `ticket:update:status_closed`,
      ticket,
      user: currentUser
    });

    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'initial status');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity]').length, 0);

  await click('[data-test-cancel]');
  findWithAssert('.modal');
  await click('[data-test-modal-confirmCancel]');

  assert.equal(find('[data-test-status]').text().trim(), 'Closed', 'status changed to closed');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity=close]').length, 1, 'new activity is rendered');
});


test('(staff) if closing a ticket errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'person_ownership',
  });

  server.patch('/tickets/:id', {
    errors: [{ detail: "Unable to close ticket." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'initial status');

  await click('[data-test-cancel]');
  await click('[data-test-modal-confirmCancel]');

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'status is rolled back');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('reopening a closed/cancelled ticket', async function(assert) {
  assert.expect(9);
  let currentUser = initSession();

  let ticket = server.create('ticket', {
    status: 'cancelled',
    kind: 'person_ownership',
    firstName: 'John',
    lastName: 'Doe',
    background: 'Lorem ipsum some background.',
    initialInformation: 'Initial info',
    sources: 'Aliases',
    connections: 'Family',
    businessActivities: 'Bizniss',
    sensitive: false,
    whysensitive: null,
    bornAt: '2004-12-01T22:00:00.000Z',
    createdAt: '2016-12-01T22:00:00.000Z',
    deadlineAt: '2018-12-01T22:00:00.000Z',
    updatedAt: '2017-01-01T22:00:00.000Z',
  });

  let done = assert.async();
  server.patch('/tickets/:id', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs.data.attributes, {
      "background": "Lorem ipsum some background.",
      "business-activities": "Bizniss",
      "company-name": null,
      "connections": "Family",
      "country": null,
      "created-at": "2016-12-01T22:00:00.000Z",
      "deadline-at": "2018-12-01T22:00:00.000Z",
      "born-at": "2004-12-01T22:00:00.000Z",
      "initial-information": "Initial info",
      "first-name": "John",
      "sensitive": false,
      "sources": "Aliases",
      "status": "in-progress",
      "updated-at": "2017-01-01T22:00:00.000Z",
      "last-name": "Doe",
      "kind": "person_ownership",
      "whysensitive": null,
      "pending-reason": null,
      "reopen-reason": "Reason for reopening."
    });

    done();

    let comment = server.create('comment', {
      body: attrs.data.attributes['reopen-reason'],
      ticket,
      user: currentUser
    });

    server.create('activity', {
      verb: `ticket:update:reopen`,
      ticket,
      user: currentUser,
      comment
    });

    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'Cancelled', 'initial status');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity]').length, 0);

  await click('[data-test-reopen]');
  findWithAssert('.modal');
  await click('[data-test-modal-confirm]');

  assert.ok(find('#ticket-reopen').closest('.formGroup').hasClass('is-invalid'), 'empty comment shows validation error');

  await fillIn('#ticket-reopen', 'Reason for reopening.');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-status]').text().trim(), 'In progress', 'status changed to in-progress');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity=reopen]').length, 1);
  assert.equal(find('[data-test-activity-body]').text().trim(), 'Reason for reopening.', 'new activity is rendered');
});


test('if reopening a ticket errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession();

  let ticket = server.create('ticket', {
    status: 'closed',
    kind: 'person_ownership',
  });

  server.patch('/tickets/:id', {
    errors: [{ detail: "Unable to reopen ticket." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'Closed', 'initial status');

  await click('[data-test-reopen]');
  await fillIn('#ticket-reopen', 'Reason for reopening.');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-status]').text().trim(), 'Closed', 'status is rolled back');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('(staff) marking a ticket as pending', async function(assert) {
  assert.expect(9);
  let currentUser = initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'person_ownership',
    firstName: 'John',
    lastName: 'Doe',
    background: 'Lorem ipsum some background.',
    initialInformation: 'Initial info',
    sources: 'Aliases',
    connections: 'Family',
    businessActivities: 'Bizniss',
    sensitive: false,
    whysensitive: null,
    bornAt: '2004-12-01T22:00:00.000Z',
    createdAt: '2016-12-01T22:00:00.000Z',
    deadlineAt: '2018-12-01T22:00:00.000Z',
    updatedAt: '2017-01-01T22:00:00.000Z',
  });

  // Can mark as pending only when a responder is assigned
  server.create('responder', {
    ticket,
    user: server.create('profile', { isStaff: true })
  });

  let done = assert.async();
  server.patch('/tickets/:id', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs.data.attributes, {
      "background": "Lorem ipsum some background.",
      "business-activities": "Bizniss",
      "company-name": null,
      "connections": "Family",
      "country": null,
      "created-at": "2016-12-01T22:00:00.000Z",
      "deadline-at": "2018-12-01T22:00:00.000Z",
      "born-at": "2004-12-01T22:00:00.000Z",
      "initial-information": "Initial info",
      "first-name": "John",
      "sensitive": false,
      "sources": "Aliases",
      "status": "pending",
      "updated-at": "2017-01-01T22:00:00.000Z",
      "last-name": "Doe",
      "kind": "person_ownership",
      "whysensitive": null,
      "pending-reason": "Reason for marking.",
      "reopen-reason": null
    });

    done();

    let comment = server.create('comment', {
      body: attrs.data.attributes['pending-reason'],
      ticket,
      user: currentUser
    });

    server.create('activity', {
      verb: `ticket:update:pending`,
      ticket,
      user: currentUser,
      comment
    });

    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'initial status');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity]').length, 0);

  await click('[data-test-mark-pending]');
  findWithAssert('.modal');
  await click('[data-test-modal-confirm]');

  assert.ok(find('#ticket-pending').closest('.formGroup').hasClass('is-invalid'), 'empty comment shows validation error');

  await fillIn('#ticket-pending', 'Reason for marking.');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-status]').text().trim(), 'Pending', 'status changed to pending');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity=pending]').length, 1);
  assert.equal(find('[data-test-activity-body]').text().trim(), 'Reason for marking.', 'new activity is rendered');
});


test('(staff) if marking a ticket as pending errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'new',
    kind: 'person_ownership',
  });

  server.create('responder', {
    ticket,
    user: server.create('profile', { isStaff: true })
  });

  server.patch('/tickets/:id', {
    errors: [{ detail: "Unable to mark ticket." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'initial status');

  await click('[data-test-mark-pending]');
  await fillIn('#ticket-pending', 'Reason for marking.');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-status]').text().trim(), 'New', 'status is rolled back');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('(staff) unmark a ticket as pending', async function(assert) {
  assert.expect(7);
  let currentUser = initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'pending',
    kind: 'person_ownership',
    firstName: 'John',
    lastName: 'Doe',
    background: 'Lorem ipsum some background.',
    initialInformation: 'Initial info',
    sources: 'Aliases',
    connections: 'Family',
    businessActivities: 'Bizniss',
    sensitive: false,
    whysensitive: null,
    bornAt: '2004-12-01T22:00:00.000Z',
    createdAt: '2016-12-01T22:00:00.000Z',
    deadlineAt: '2018-12-01T22:00:00.000Z',
    updatedAt: '2017-01-01T22:00:00.000Z',
  });

  server.create('responder', {
    ticket,
    user: server.create('profile', { isStaff: true })
  });

  let done = assert.async();
  server.patch('/tickets/:id', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs.data.attributes, {
      "background": "Lorem ipsum some background.",
      "business-activities": "Bizniss",
      "company-name": null,
      "connections": "Family",
      "country": null,
      "created-at": "2016-12-01T22:00:00.000Z",
      "deadline-at": "2018-12-01T22:00:00.000Z",
      "born-at": "2004-12-01T22:00:00.000Z",
      "initial-information": "Initial info",
      "first-name": "John",
      "sensitive": false,
      "sources": "Aliases",
      "status": "in-progress",
      "updated-at": "2017-01-01T22:00:00.000Z",
      "last-name": "Doe",
      "kind": "person_ownership",
      "whysensitive": null,
      "pending-reason": null,
      "reopen-reason": null
    });

    done();

    server.create('activity', {
      verb: `ticket:update:status_in-progress`,
      ticket,
      user: currentUser
    });

    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'Pending', 'initial status');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity]').length, 0);

  await click('[data-test-unmark-pending]');
  findWithAssert('.modal');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-status]').text().trim(), 'In progress', 'status changed to in-progress');
  assert.equal(find('.modal').length, 0);
  assert.equal(find('[data-test-activity=resume]').length, 1, 'new activity is rendered');
});


test('(staff) if unmarking a ticket as pending errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession({ isStaff: true });

  let ticket = server.create('ticket', {
    status: 'pending',
    kind: 'person_ownership',
  });

  server.create('responder', {
    ticket,
    user: server.create('profile', { isStaff: true })
  });

  server.patch('/tickets/:id', {
    errors: [{ detail: "Unable to unmark ticket." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'Pending', 'initial status');

  await click('[data-test-unmark-pending]');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-status]').text().trim(), 'Pending', 'status is rolled back');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});