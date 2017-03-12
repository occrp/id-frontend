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
          "created": null,
          "deadline": "2100-01-04T22:00:00.000Z",
          "dob": "2004-12-01T22:00:00.000Z",
          "family": "Family",
          "findings-visible": false,
          "initial-information": "Initial lorem ipsum.",
          "is-for-profit": false,
          "is-public": false,
          "name": "John",
          "question": null,
          "sensitive": true,
          "sources": null,
          "status": "new",
          "status-updated": null,
          "surname": "Doe",
          "type": "person_ownership",
          "user-pays": false,
          "why-sensitive": "It just is."
        },
        "relationships": {
          "assignee": {
            "data": null
          },
          "author": {
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

  fillIn('#ticket-name', 'John');
  fillIn('#ticket-surname', 'Doe');
  fillIn('#ticket-background', 'Lorem ipsum some background.');
  fillIn('#ticket-initialInformation', 'Initial lorem ipsum.');

  fillIn('#ticket-dob', '02/12/2004');
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
          "created": null,
          "deadline": null,
          "dob": null,
          "family": null,
          "findings-visible": false,
          "initial-information": null,
          "is-for-profit": false,
          "is-public": false,
          "name": null,
          "question": null,
          "sensitive": false,
          "sources": "Sources lorem ipsum.",
          "status": "new",
          "status-updated": null,
          "surname": null,
          "type": "company_ownership",
          "user-pays": false,
          "why-sensitive": null
        },
        "relationships": {
          "assignee": {
            "data": null
          },
          "author": {
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

  click('[data-test-type-tab="company"]');

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
          "created": null,
          "deadline": null,
          "dob": null,
          "family": null,
          "findings-visible": false,
          "initial-information": null,
          "is-for-profit": false,
          "is-public": false,
          "name": null,
          "question": "My question.",
          "sensitive": false,
          "sources": null,
          "status": "new",
          "status-updated": null,
          "surname": null,
          "type": "other",
          "user-pays": false,
          "why-sensitive": null
        },
        "relationships": {
          "assignee": {
            "data": null
          },
          "author": {
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

  click('[data-test-type-tab="other"]');

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

    assert.ok(find('#ticket-name').closest('.form-group').hasClass('has-error'));
    assert.ok(find('#ticket-surname').closest('.form-group').hasClass('has-error'));
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

  click('[data-test-type-tab="company"]');
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
    assert.ok(find('#ticket-name').closest('.form-group').hasClass('has-error'));
    findWithAssert('[data-test-validation-errors]');
  });

  click('[data-test-type-tab="company"]');

  andThen(() => {
    assert.equal(find('[data-test-validation-errors]').length, 0);
  });

  click('[data-test-save]');

  andThen(() => {
    assert.ok(find('#ticket-companyName').closest('.form-group').hasClass('has-error'));
  });

  click('[data-test-type-tab="person"]');

  andThen(() => {
    assert.ok(!find('#ticket-name').closest('.form-group').hasClass('has-error'));
    assert.equal(find('[data-test-validation-errors]').length, 0);
  });

  click('[data-test-type-tab="company"]');

  andThen(() => {
    assert.ok(!find('#ticket-companyName').closest('.form-group').hasClass('has-error'));
  });
});
