import { test } from 'qunit';
import moduleForAcceptance from 'id2-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/new');

test('creating a new ticket (person)', function(assert) {
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
    return schema.tickets.create(attrs);
  });

  visit('/new');

  andThen(function() {
    assert.equal(currentURL(), '/new');
  });

  fillIn('#ticket-first-name', 'John');
  fillIn('#ticket-last-name', 'Doe');
  fillIn('#ticket-background', 'Lorem ipsum some background.');
  fillIn('#ticket-initialInformation', 'Initial lorem ipsum.');

  fillIn('#ticket-born-at', '02/12/2004');
  fillIn('#ticket-sources-person', 'Aliases');
  fillIn('#ticket-connections-person', 'Family');
  fillIn('#ticket-businessActivities', 'Bizniss');

  fillIn('#ticket-deadline', '05/01/2100');
  click('#ticket-sensitive');
  fillIn('#ticket-whySensitive', 'It just is.');

  click('[data-test-save]');

  andThen(() => {
    assert.equal(currentURL(), '/view/4');

    assert.equal(find('[data-test-name]').text(), 'John Doe');
  });
});


test('creating a new ticket (company)', function(assert) {
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
    return schema.tickets.create(attrs);
  });

  visit('/new');

  click('[data-test-kind-tab="company"]');

  fillIn('#ticket-companyName', 'Acme Inc.');
  fillIn('#ticket-country', 'RO');
  fillIn('#ticket-background-company', 'Lorem ipsum some company background.');
  fillIn('#ticket-sources', 'Sources lorem ipsum.');

  fillIn('#ticket-connections', 'Connections');

  click('[data-test-save]');

  andThen(() => {
    assert.equal(currentURL(), '/view/4');

    assert.equal(find('[data-test-name]').text(), 'Acme Inc.');
  });
});


test('creating a new ticket (other)', function(assert) {
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
    return schema.tickets.create(attrs);
  });

  visit('/new');

  click('[data-test-kind-tab="other"]');

  fillIn('#ticket-background-other', 'My question.');

  click('[data-test-save]');

  andThen(() => {
    assert.equal(currentURL(), '/view/4');

    assert.equal(find('[data-test-background]').text(), 'My question.');
  });
});

test('creating a new ticket (person) - validations', function(assert) {
  assert.expect(6);

  visit('/new');

  andThen(function() {
    assert.equal(currentURL(), '/new');
  });

  click('[data-test-save]');

  andThen(() => {
    assert.equal(currentURL(), '/new');

    assert.ok(find('#ticket-first-name').closest('.form-group').hasClass('has-error'));
    assert.ok(find('#ticket-last-name').closest('.form-group').hasClass('has-error'));
    assert.ok(find('#ticket-background').closest('.form-group').hasClass('has-error'));
    assert.ok(find('#ticket-initialInformation').closest('.form-group').hasClass('has-error'));

    findWithAssert('[data-test-validation-errors]');
  });
});

test('creating a new ticket (company) - validations', function(assert) {
  assert.expect(6);

  visit('/new');

  andThen(function() {
    assert.equal(currentURL(), '/new');
  });

  click('[data-test-kind-tab="company"]');
  click('[data-test-save]');

  andThen(() => {
    assert.equal(currentURL(), '/new');

    assert.ok(find('#ticket-companyName').closest('.form-group').hasClass('has-error'));
    assert.ok(find('#ticket-country').closest('.form-group').hasClass('has-error'));
    assert.ok(find('#ticket-background-company').closest('.form-group').hasClass('has-error'));
    assert.ok(find('#ticket-sources').closest('.form-group').hasClass('has-error'));

    findWithAssert('[data-test-validation-errors]');
  });
});

test('creating a new ticket - switching tabs resets validations', function(assert) {
  assert.expect(7);

  visit('/new');

  andThen(function() {
    assert.equal(currentURL(), '/new');
  });

  click('[data-test-save]');

  andThen(() => {
    assert.ok(find('#ticket-first-name').closest('.form-group').hasClass('has-error'));
    findWithAssert('[data-test-validation-errors]');
  });

  click('[data-test-kind-tab="company"]');

  andThen(() => {
    assert.equal(find('[data-test-validation-errors]').length, 0);
  });

  click('[data-test-save]');

  andThen(() => {
    assert.ok(find('#ticket-companyName').closest('.form-group').hasClass('has-error'));
  });

  click('[data-test-kind-tab="person"]');

  andThen(() => {
    assert.ok(!find('#ticket-first-name').closest('.form-group').hasClass('has-error'));
    assert.equal(find('[data-test-validation-errors]').length, 0);
  });

  click('[data-test-kind-tab="company"]');

  andThen(() => {
    assert.ok(!find('#ticket-companyName').closest('.form-group').hasClass('has-error'));
  });
});
