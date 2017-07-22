import { test } from 'qunit';
import moduleForAcceptance from 'id2-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/new');

test('creating a new ticket (person)', async function(assert) {
  assert.expect(4);

  server.createList('ticket', 3);

  let done = assert.async();
  server.post('/tickets', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs, {
      "data": {
        "attributes": {
          "background": "Lorem ipsum some background.",
          "business-activities": "Bizniss",
          "company-name": null,
          "connections": "Family",
          "country": null,
          "created-at": null,
          "deadline-at": "2100-01-05T00:00:00.000Z",
          "born-at": "2004-12-02T00:00:00.000Z",
          "initial-information": "Initial lorem ipsum.",
          "first-name": "John",
          "sensitive": true,
          "sources": "Aliases",
          "status": "new",
          "updated-at": null,
          "last-name": "Doe",
          "kind": "person_ownership",
          "why-sensitive": "It just is."
        },
        "relationships": {
          "requester": {
            "data": null
          }
        },
        "type": "tickets"
      }
    });

    done();
    return schema.tickets.create(Object.assign({}, attrs, {
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    }));
  });

  await visit('/new');

  assert.equal(currentURL(), '/new');

  await fillIn('#ticket-first-name', 'John');
  await fillIn('#ticket-last-name', 'Doe');
  await fillIn('#ticket-background', 'Lorem ipsum some background.');
  await fillIn('#ticket-initialInformation', 'Initial lorem ipsum.');

  await fillIn('#ticket-born-at', '02/12/2004');
  await fillIn('#ticket-sources-person', 'Aliases');
  await fillIn('#ticket-connections-person', 'Family');
  await fillIn('#ticket-businessActivities', 'Bizniss');

  await fillIn('#ticket-deadline', '05/01/2100');
  await click('#ticket-sensitive');
  await fillIn('#ticket-whySensitive', 'It just is.');

  await click('[data-test-save]');

  assert.equal(currentURL(), '/view/4');

  assert.equal(find('[data-test-name]').text(), 'John Doe');
});


test('creating a new ticket (company)', async function(assert) {
  assert.expect(3);

  server.createList('ticket', 3);

  let done = assert.async();
  server.post('/tickets', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs, {
      "data": {
        "attributes": {
          "background": "Lorem ipsum some company background.",
          "business-activities": null,
          "company-name": "Acme Inc.",
          "connections": "Connections",
          "country": "RO",
          "created-at": null,
          "deadline-at": null,
          "born-at": null,
          "initial-information": null,
          "first-name": null,
          "sensitive": false,
          "sources": "Sources lorem ipsum.",
          "status": "new",
          "updated-at": null,
          "last-name": null,
          "kind": "company_ownership",
          "why-sensitive": null
        },
        "relationships": {
          "requester": {
            "data": null
          }
        },
        "type": "tickets"
      }
    });

    done();
    return schema.tickets.create(Object.assign({}, attrs, {
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    }));
  });

  await visit('/new');

  await click('[data-test-kind-tab="company"]');

  await fillIn('#ticket-companyName', 'Acme Inc.');
  await fillIn('#ticket-country', 'RO');
  await fillIn('#ticket-background-company', 'Lorem ipsum some company background.');
  await fillIn('#ticket-sources', 'Sources lorem ipsum.');

  await fillIn('#ticket-connections', 'Connections');

  await click('[data-test-save]');

  assert.equal(currentURL(), '/view/4');

  assert.equal(find('[data-test-name]').text(), 'Acme Inc.');
});


test('creating a new ticket (other)', async function(assert) {
  assert.expect(3);

  server.createList('ticket', 3);

  let done = assert.async();
  server.post('/tickets', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs, {
      "data": {
        "attributes": {
          "background": "My question.",
          "business-activities": null,
          "company-name": null,
          "connections": null,
          "country": null,
          "created-at": null,
          "deadline-at": null,
          "born-at": null,
          "initial-information": null,
          "first-name": null,
          "sensitive": false,
          "sources": null,
          "status": "new",
          "updated-at": null,
          "last-name": null,
          "kind": "other",
          "why-sensitive": null
        },
        "relationships": {
          "requester": {
            "data": null
          }
        },
        "type": "tickets"
      }
    });

    done();
    return schema.tickets.create(Object.assign({}, attrs, {
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    }));
  });

  await visit('/new');

  await click('[data-test-kind-tab="other"]');

  await fillIn('#ticket-background-other', 'My question.');

  await click('[data-test-save]');

  assert.equal(currentURL(), '/view/4');

  assert.equal(find('[data-test-background]').text(), 'My question.');
});

test('creating a new ticket (person) - validations', async function(assert) {
  assert.expect(6);

  await visit('/new');

  assert.equal(currentURL(), '/new');

  await click('[data-test-save]');

  assert.equal(currentURL(), '/new');

  assert.ok(find('#ticket-first-name').closest('.form-group').hasClass('has-error'));
  assert.ok(find('#ticket-last-name').closest('.form-group').hasClass('has-error'));
  assert.ok(find('#ticket-background').closest('.form-group').hasClass('has-error'));
  assert.ok(find('#ticket-initialInformation').closest('.form-group').hasClass('has-error'));

  findWithAssert('[data-test-validation-errors]');
});

test('creating a new ticket (company) - validations', async function(assert) {
  assert.expect(6);

  await visit('/new');

  assert.equal(currentURL(), '/new');

  await click('[data-test-kind-tab="company"]');
  await click('[data-test-save]');

  assert.equal(currentURL(), '/new');

  assert.ok(find('#ticket-companyName').closest('.form-group').hasClass('has-error'));
  assert.ok(find('#ticket-country').closest('.form-group').hasClass('has-error'));
  assert.ok(find('#ticket-background-company').closest('.form-group').hasClass('has-error'));
  assert.ok(find('#ticket-sources').closest('.form-group').hasClass('has-error'));

  findWithAssert('[data-test-validation-errors]');
});

test('creating a new ticket - switching tabs resets validations', async function(assert) {
  assert.expect(7);

  await visit('/new');

  assert.equal(currentURL(), '/new');

  await click('[data-test-save]');

  assert.ok(find('#ticket-first-name').closest('.form-group').hasClass('has-error'));
  findWithAssert('[data-test-validation-errors]');

  await click('[data-test-kind-tab="company"]');

  assert.equal(find('[data-test-validation-errors]').length, 0);

  await click('[data-test-save]');

  assert.ok(find('#ticket-companyName').closest('.form-group').hasClass('has-error'));

  await click('[data-test-kind-tab="person"]');

  assert.ok(!find('#ticket-first-name').closest('.form-group').hasClass('has-error'));
  assert.equal(find('[data-test-validation-errors]').length, 0);

  await click('[data-test-kind-tab="company"]');

  assert.ok(!find('#ticket-companyName').closest('.form-group').hasClass('has-error'));
});
