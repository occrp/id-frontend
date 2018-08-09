import { click, fillIn, findAll, currentURL, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | tickets/new', function(hooks) {
  setupApplicationTest(hooks);

  test('creating a new ticket (person)', async function(assert) {
    assert.expect(4);
    initSession();

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
            "country": "AD",
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
            "whysensitive": "It just is.",
            "pending-reason": null,
            "reopen-reason": null
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
    await fillIn('#ticket-nationality', 'AD');
    await fillIn('#ticket-background', 'Lorem ipsum some background.');
    await fillIn('#ticket-initialInformation', 'Initial lorem ipsum.');

    await fillIn('#ticket-born-at', '02/12/2004');
    await fillIn('#ticket-sources-person', 'Aliases');
    await fillIn('#ticket-connections-person', 'Family');
    await fillIn('#ticket-businessActivities', 'Bizniss');

    await fillIn('#ticket-deadline', '05/01/2100');
    await click('#ticket-sensitive');
    await fillIn('#ticket-whysensitive', 'It just is.');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/view/4');

    assert.equal(find('[data-test-name]').textContent, 'John Doe');
  });


  test('creating a new ticket (company)', async function(assert) {
    assert.expect(3);
    initSession();

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
            "whysensitive": null,
            "pending-reason": null,
            "reopen-reason": null
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

    assert.equal(find('[data-test-name]').textContent, 'Acme Inc.');
  });


  test('creating a new ticket (other)', async function(assert) {
    assert.expect(3);
    initSession();

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
            "whysensitive": null,
            "pending-reason": null,
            "reopen-reason": null
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

    assert.equal(find('[data-test-background]').textContent, 'My question.');
  });


  test('creating a new ticket (person) - validations', async function(assert) {
    assert.expect(6);
    initSession();

    await visit('/new');

    assert.equal(currentURL(), '/new');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/new');

    assert.ok(find('#ticket-first-name').closest('.formGroup').hasClass('is-invalid'));
    assert.ok(find('#ticket-last-name').closest('.formGroup').hasClass('is-invalid'));
    assert.ok(find('#ticket-background').closest('.formGroup').hasClass('is-invalid'));
    assert.ok(find('#ticket-initialInformation').closest('.formGroup').hasClass('is-invalid'));

    findWithAssert('[data-test-validation-errors]');
  });


  test('creating a new ticket (company) - validations', async function(assert) {
    assert.expect(6);
    initSession();

    await visit('/new');

    assert.equal(currentURL(), '/new');

    await click('[data-test-kind-tab="company"]');
    await click('[data-test-save]');

    assert.equal(currentURL(), '/new');

    assert.ok(find('#ticket-companyName').closest('.formGroup').hasClass('is-invalid'));
    assert.ok(find('#ticket-country').closest('.formGroup').hasClass('is-invalid'));
    assert.ok(find('#ticket-background-company').closest('.formGroup').hasClass('is-invalid'));
    assert.ok(find('#ticket-sources').closest('.formGroup').hasClass('is-invalid'));

    findWithAssert('[data-test-validation-errors]');
  });


  test('creating a new ticket - switching tabs resets validations', async function(assert) {
    assert.expect(7);
    initSession();

    await visit('/new');

    assert.equal(currentURL(), '/new');

    await click('[data-test-save]');

    assert.ok(find('#ticket-first-name').closest('.formGroup').hasClass('is-invalid'));
    findWithAssert('[data-test-validation-errors]');

    await click('[data-test-kind-tab="company"]');

    assert.equal(findAll('[data-test-validation-errors]').length, 0);

    await click('[data-test-save]');

    assert.ok(find('#ticket-companyName').closest('.formGroup').hasClass('is-invalid'));

    await click('[data-test-kind-tab="person"]');

    assert.ok(!find('#ticket-first-name').closest('.formGroup').hasClass('is-invalid'));
    assert.equal(findAll('[data-test-validation-errors]').length, 0);

    await click('[data-test-kind-tab="company"]');

    assert.ok(!find('#ticket-companyName').closest('.formGroup').hasClass('is-invalid'));
  });


  test('if creating a ticket errors, a message is displayed', async function(assert) {
    assert.expect(2);
    initSession();

    server.post('/tickets', {
      errors: [{ detail: "Ticket creation error." }]
    }, 500);

    await visit('/new');

    await click('[data-test-kind-tab="other"]');
    await fillIn('#ticket-background-other', 'My question.');

    await assert.asyncThrows(() => {
      return click('[data-test-save]');
    }, `POST ${server.namespace}/tickets returned a 500`);

    assert.ok(findAll('[data-test-submit-error]').length > 0);
  });
});