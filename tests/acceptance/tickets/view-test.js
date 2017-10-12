import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view');

test('rendering ticket details (person)', async function(assert) {
  assert.expect(4);
  initSession();

  let ticket = server.create('ticket', {
    kind: 'person_ownership',
    firstName: 'John',
    lastName: 'Doe',
    background: 'Lorem ipsum some background.',
    bornAt: '2004-12-02T00:00:00.000Z',
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(currentURL(), `/view/${ticket.id}`);

  assert.equal(find('[data-test-name]').text(), 'John Doe');
  assert.equal(find('[data-test-background]').text(), 'Lorem ipsum some background.');
  assert.equal(find('[data-test-born-at]').text(), 'December 2, 2004');
});


test('rendering ticket details (company)', async function(assert) {
  assert.expect(4);
  initSession();

  let ticket = server.create('ticket', {
    kind: 'company_ownership',
    companyName: 'Acme Inc.',
    country: 'BA',
    background: 'Lorem ipsum some comapny background.',
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(currentURL(), `/view/${ticket.id}`);

  assert.equal(find('[data-test-name]').text(), 'Acme Inc.');
  assert.equal(find('[data-test-country]').text(), 'Bosnia and Herzegovina');
  assert.equal(find('[data-test-background]').text(), 'Lorem ipsum some comapny background.');
});


test('rendering ticket details (other)', async function(assert) {
  assert.expect(2);
  initSession();

  let ticket = server.create('ticket', {
    kind: 'other',
    background: 'My question.'
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(currentURL(), `/view/${ticket.id}`);

  assert.equal(find('[data-test-background]').text(), 'My question.');
});


test('cancelling a ticket', async function(assert) {
  assert.expect(6);
  initSession();

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
    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(currentURL(), `/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New');
  assert.equal(find('.modal').length, 0);

  await click('[data-test-cancel]');

  findWithAssert('.modal');

  await click('[data-test-modal-confirmCancel]');

  assert.equal(find('[data-test-status]').text().trim(), 'Cancelled');
  assert.equal(find('.modal').length, 0);
});

test('(staff) closing a ticket', async function(assert) {
  assert.expect(6);
  initSession({ isStaff: true });

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
    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(currentURL(), `/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New');
  assert.equal(find('.modal').length, 0);

  await click('[data-test-cancel]');

  findWithAssert('.modal');

  await click('[data-test-modal-confirmCancel]');

  assert.equal(find('[data-test-status]').text().trim(), 'Closed');
  assert.equal(find('.modal').length, 0);
});
