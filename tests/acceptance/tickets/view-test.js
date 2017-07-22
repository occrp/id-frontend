import { test } from 'qunit';
import moduleForAcceptance from 'id2-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view');

test('rendering ticket details (person)', async function(assert) {
  assert.expect(4);

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

  server.create('profile', {
    id: 42,
    email: "user@mail.com",
    firstName: 'John',
    lastName: 'Appleseed',
    isStaff: false,
    isSuperuser: false
  });

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
    whySensitive: null,
    bornAt: '2004-12-01T22:00:00.000Z',
    createdAt: '2016-12-01T22:00:00.000Z',
    deadlineAt: '2018-12-01T22:00:00.000Z',
    updatedAt: '2017-01-01T22:00:00.000Z'
  });

  // let done = assert.async();
  server.patch('/tickets/:id', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs, {
      "data": {
        "attributes": {
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
          "sensitive": true,
          "sources": "Aliases",
          "status": "cancelled",
          "updated-at": "2017-01-01T22:00:00.000Z",
          "last-name": "Doe",
          "kind": "person_ownership",
          "why-sensitive": null
        },
        "id": "1",
        "relationships": {
          "requester": {
            "data": {
              "id": "42",
              "type": "profiles"
            }
          }
        },
        "type": "tickets"
      }
    });

    // done();
    return ticket.update(attrs.data.attributes);
  });

  await visit(`/view/${ticket.id}`);

  assert.equal(currentURL(), `/view/${ticket.id}`);

  assert.equal(find('[data-test-status]').text().trim(), 'New');
  assert.equal(find('.ember-modal-dialog').length, 0);

  await click('[data-test-cancel]');

  findWithAssert('.ember-modal-dialog');

  await click('[data-test-modal-confirmCancel]');

  assert.equal(find('[data-test-status]').text().trim(), 'Cancelled');
  assert.equal(find('.ember-modal-dialog').length, 0);
});
