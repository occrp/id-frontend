import { test } from 'qunit';
import moduleForAcceptance from 'id2-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view');

test('rendering ticket details (person)', function(assert) {
  assert.expect(4);

  let ticket = server.create('ticket', {
    type: 'person_ownership',
    name: 'John',
    surname: 'Doe',
    background: 'Lorem ipsum some background.',
    dob: '2004-12-01T22:00:00.000Z',
  });

  visit(`/view/${ticket.id}`);

  andThen(() => {
    assert.equal(currentURL(), `/view/${ticket.id}`);

    assert.equal(find('[data-test-name]').text(), 'John Doe');
    assert.equal(find('[data-test-background]').text(), 'Lorem ipsum some background.');
    assert.equal(find('[data-test-dob]').text(), 'December 2, 2004');
  });
});


test('rendering ticket details (company)', function(assert) {
  assert.expect(4);

  let ticket = server.create('ticket', {
    type: 'company_ownership',
    companyName: 'Acme Inc.',
    country: 'BA',
    companyBackground: 'Lorem ipsum some comapny background.',
  });

  visit(`/view/${ticket.id}`);

  andThen(() => {
    assert.equal(currentURL(), `/view/${ticket.id}`);

    assert.equal(find('[data-test-name]').text(), 'Acme Inc.');
    assert.equal(find('[data-test-country]').text(), 'Bosnia and Herzegovina');
    assert.equal(find('[data-test-companyBackground]').text(), 'Lorem ipsum some comapny background.');
  });
});


test('rendering ticket details (other)', function(assert) {
  assert.expect(2);

  let ticket = server.create('ticket', {
    type: 'other',
    question: 'My question.'
  });

  visit(`/view/${ticket.id}`);

  andThen(() => {
    assert.equal(currentURL(), `/view/${ticket.id}`);

    assert.equal(find('[data-test-question]').text(), 'My question.');
  });
});


test('cancelling a ticket', function(assert) {
  assert.expect(6);

  server.create('user', {
    id: 42,
    email: "user@mail.com",
    firstName: 'John',
    lastName: 'Appleseed',
    isStaff: false,
    isSuperuser: false
  });

  let ticket = server.create('ticket', {
    status: 'new',
    type: 'person_ownership',
    name: 'John',
    surname: 'Doe',
    background: 'Lorem ipsum some background.',
    initialInformation: 'Initial info',
    family: 'Family',
    aliases: 'Aliases',
    businessActivities: 'Bizniss',
    whySensitive: null,
    dob: '2004-12-01T22:00:00.000Z',
    created: '2016-12-01T22:00:00.000Z',
    deadline: '2018-12-01T22:00:00.000Z',
    statusUpdated: '2017-01-01T22:00:00.000Z'
  });

  let done = assert.async();
  server.patch('/tickets/:id', (schema, request) => {
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
          "created": "2016-12-01T22:00:00.000Z",
          "deadline": "2018-12-01T22:00:00.000Z",
          "dob": "2004-12-01T22:00:00.000Z",
          "family": "Family",
          "initial-information": "Initial info",
          "name": "John",
          "question": null,
          "sensitive": true,
          "sources": null,
          "status": "cancelled",
          "status-updated": "2017-01-01T22:00:00.000Z",
          "surname": "Doe",
          "type": "person_ownership",
          "why-sensitive": null
        },
        "id": "1",
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
    return ticket.update(attrs.data.attributes);
  });

  visit(`/view/${ticket.id}`);

  andThen(() => {
    assert.equal(currentURL(), `/view/${ticket.id}`);

    assert.equal(find('[data-test-status]').text().trim(), 'New');
    assert.equal(find('.ember-modal-dialog').length, 0);
  });

  click('[data-test-cancel]');

  andThen(() => {
    findWithAssert('.ember-modal-dialog');
  });

  click('[data-test-modal-confirmCancel]');

  andThen(() => {
    assert.equal(find('[data-test-status]').text().trim(), 'Cancelled');
    assert.equal(find('.ember-modal-dialog').length, 0);
  });

});
