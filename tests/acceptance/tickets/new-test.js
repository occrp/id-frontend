import { click, fillIn, findAll, currentURL, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | tickets/new', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);

  test('creating a new ticket (person)', async function(assert) {
    assert.expect(4);
    initSession();

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
            "countries": [],
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
            "reopen-reason": null,
            "member-center": "OCCRP",
            "priority": "default",
            "identifier": "ID#0"
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
    await fillIn('#ticket-identifier', 'ID#0');

    await fillIn('#ticket-born-at', '02/12/2004');
    await fillIn('#ticket-sources-person', 'Aliases');
    await fillIn('#ticket-connections-person', 'Family');
    await fillIn('#ticket-businessActivities', 'Bizniss');

    await fillIn('#ticket-member-center', 'OCCRP');

    await fillIn('#ticket-deadline', '05/01/2100');
    await click('#ticket-sensitive');
    await fillIn('#ticket-whysensitive', 'It just is.');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/view/1');

    assert.equal(find('[data-test-name]').textContent.trim(), 'John Doe');
  });


  test('creating a new ticket (company)', async function(assert) {
    assert.expect(3);
    initSession();

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
            "countries": [],
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
            "reopen-reason": null,
            "member-center": 'OCCRP',
            "priority": "default",
            "identifier": "ID#1"
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

    await click('[data-test-kind-tab="company_ownership"]');

    await fillIn('#ticket-companyName', 'Acme Inc.');
    await fillIn('#ticket-country', 'RO');
    await fillIn('#ticket-background-company', 'Lorem ipsum some company background.');
    await fillIn('#ticket-sources', 'Sources lorem ipsum.');
    await fillIn('#ticket-identifier', 'ID#1');

    await fillIn('#ticket-connections', 'Connections');
    await fillIn('#ticket-member-center', 'OCCRP');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/view/1');

    assert.equal(find('[data-test-name]').textContent.trim(), 'Acme Inc.');
  });

  test('creating a new ticket (vehicle)', async function(assert) {
    assert.expect(3);
    initSession();

    let done = assert.async();

    server.post('/tickets', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs, {
        "data": {
          "attributes": {
            "background": "Vehicle details.",
            "business-activities": null,
            "company-name": null,
            "connections": null,
            "countries": [],
            "country": "RO",
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
            "kind": "vehicle_tracking",
            "whysensitive": null,
            "pending-reason": null,
            "reopen-reason": null,
            "member-center": 'OCCRP',
            "priority": "default",
            "identifier": "ID#1"
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

    await click('[data-test-kind-tab="vehicle_tracking"]');

    await fillIn('#ticket-identifier-vehicle', 'ID#1');
    await fillIn('#ticket-country-vehicle', 'RO');
    await fillIn('#ticket-background-vehicle', 'Vehicle details.');
    await fillIn('#ticket-member-center', 'OCCRP');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/view/1');

    assert.ok(
      find('[data-test="background"]').textContent.includes('Vehicle details.')
    );
  });

  test('creating a new ticket (data)', async function(assert) {
    assert.expect(3);
    initSession();

    let done = assert.async();

    server.post('/tickets', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs, {
        "data": {
          "attributes": {
            "background": "Data details.",
            "business-activities": null,
            "company-name": null,
            "connections": null,
            "countries": [],
            "country": null,
            "created-at": null,
            "deadline-at": null,
            "born-at": null,
            "initial-information": "analysis",
            "first-name": null,
            "sensitive": false,
            "sources": "Data sources.",
            "status": "new",
            "updated-at": null,
            "last-name": null,
            "kind": "data_request",
            "whysensitive": null,
            "pending-reason": null,
            "reopen-reason": null,
            "member-center": 'OCCRP',
            "priority": "default",
            "identifier": null
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

    await click('[data-test-kind-tab="data_request"]');

    await fillIn('#ticket-category', 'analysis');
    await fillIn('#ticket-background-data', 'Data details.');
    await fillIn('#ticket-sources-data', 'Data sources.');
    await fillIn('#ticket-member-center', 'OCCRP');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/view/1');

    assert.ok(
      find('[data-test="background"]').textContent.includes('Data details.')
    );
  });

  test('creating a new ticket (other)', async function(assert) {
    assert.expect(3);
    initSession();

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
            "countries": [],
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
            "reopen-reason": null,
            "member-center": "OCCRP",
            "priority": "default",
            "identifier": null
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
    await fillIn('#ticket-member-center', 'OCCRP');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/view/1');

    assert.ok(
      find('[data-test="background"]').textContent.includes('My question.')
    );
  });


  test('creating a new ticket (person) - validations', async function(assert) {
    assert.expect(7);
    initSession();

    await visit('/new');

    assert.equal(currentURL(), '/new');

    await click('[data-test-save]');

    assert.equal(currentURL(), '/new');

    assert.ok(find('#ticket-first-name').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('#ticket-last-name').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('#ticket-background').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('#ticket-initialInformation').closest('.formGroup').classList.contains('is-invalid'));

    assert.ok(find('[data-test-validation-errors]'));
  });


  test('creating a new ticket (company) - validations', async function(assert) {
    assert.expect(7);
    initSession();

    await visit('/new');

    assert.equal(currentURL(), '/new');

    await click('[data-test-kind-tab="company_ownership"]');
    await click('[data-test-save]');

    assert.equal(currentURL(), '/new');

    assert.ok(find('#ticket-companyName').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('#ticket-country').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('#ticket-background-company').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('#ticket-sources').closest('.formGroup').classList.contains('is-invalid'));

    assert.ok(find('[data-test-validation-errors]'));
  });


  test('creating a new ticket - switching tabs resets validations', async function(assert) {
    assert.expect(7);
    initSession();

    await visit('/new');

    assert.equal(currentURL(), '/new');

    await click('[data-test-save]');

    assert.ok(find('#ticket-first-name').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('[data-test-validation-errors]'));

    await click('[data-test-kind-tab="company_ownership"]');

    assert.equal(find('[data-test-validation-errors]'), null);

    await click('[data-test-save]');

    assert.ok(find('#ticket-companyName').closest('.formGroup').classList.contains('is-invalid'));
    assert.ok(find('[data-test-validation-errors]'));

    await click('[data-test-kind-tab="person_ownership"]');

    assert.equal(find('[data-test-validation-errors]'), null);
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
    await fillIn('#ticket-member-center', 'OCCRP');

    await assert.asyncThrows(() => {
      return click('[data-test-save]');
    }, `POST ${server.namespace}/tickets returned a 500`);

    assert.ok(findAll('[data-test-submit-error]').length > 0);
  });
});
