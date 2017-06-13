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
          "aliases": "Aliases",
          "background": "Lorem ipsum some background.",
          "business-activities": "Bizniss",
          "company-background": null,
          "company-name": null,
          "connections": null,
          "country": null,
          "created-at": null,
          "deadline-at": "2100-01-04T22:00:00.000Z",
          "born-at": "2004-12-01T22:00:00.000Z",
          "family": "Family",
          "initial-information": "Initial lorem ipsum.",
          "first-name": "John",
          "question": null,
          "sensitive": true,
          "sources": null,
          "status": "new",
          "updated-at": null,
          "last-name": "Doe",
          "kind": "person_ownership",
          "why-sensitive": "It just is."
        },
        "relationships": {
          "assignee": {
            "data": null
          },
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
  fillIn('#ticket-aliases', 'Aliases');
  fillIn('#ticket-family', 'Family');
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
          "aliases": null,
          "background": null,
          "business-activities": null,
          "company-background": "Lorem ipsum some company background.",
          "company-name": "Acme Inc.",
          "connections": "Connections",
          "country": "RO",
          "created-at": null,
          "deadline-at": null,
          "born-at": null,
          "family": null,
          "initial-information": null,
          "first-name": null,
          "question": null,
          "sensitive": false,
          "sources": "Sources lorem ipsum.",
          "status": "new",
          "updated-at": null,
          "last-name": null,
          "kind": "company_ownership",
          "why-sensitive": null
        },
        "relationships": {
          "assignee": {
            "data": null
          },
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
  fillIn('#ticket-companyBackground', 'Lorem ipsum some company background.');
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
          "aliases": null,
          "background": null,
          "business-activities": null,
          "company-background": null,
          "company-name": null,
          "connections": null,
          "country": null,
          "created-at": null,
          "deadline-at": null,
          "born-at": null,
          "family": null,
          "initial-information": null,
          "first-name": null,
          "question": "My question.",
          "sensitive": false,
          "sources": null,
          "status": "new",
          "updated-at": null,
          "last-name": null,
          "kind": "other",
          "why-sensitive": null
        },
        "relationships": {
          "assignee": {
            "data": null
          },
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

  fillIn('#ticket-question', 'My question.');

  click('[data-test-save]');

  andThen(() => {
    assert.equal(currentURL(), '/view/4');

    assert.equal(find('[data-test-question]').text(), 'My question.');
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
    assert.ok(find('#ticket-companyBackground').closest('.form-group').hasClass('has-error'));
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
