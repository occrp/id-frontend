import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view - edit');

test('(admin) editing the ticket deadline', async function(assert) {
  assert.expect(3);
  initSession({ isSuperuser: true });

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
      "deadline-at": "2100-03-20T00:00:00.000Z",
      "born-at": "2004-12-01T22:00:00.000Z",
      "initial-information": "Initial info",
      "first-name": "John",
      "sensitive": false,
      "sources": "Aliases",
      "status": "new",
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

  assert.equal(find('[data-test-deadline-at]').attr('datetime'), '2018-12-01T22:00:00.000Z', 'initial deadline');

  await click('[data-test-ea-open]');
  await fillIn('#ticket-deadline', '20/03/2100');

  await click('[data-test-ea-save]');

  assert.equal(find('[data-test-deadline-at]').attr('datetime'), '2100-03-20T00:00:00.000Z');
});

test('(admin) if editing the ticket deadline errors, a message is displayed', async function(assert) {
  assert.expect(3);
  initSession({ isSuperuser: true });

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

  server.patch('/tickets/:id', {
    errors: [{ detail: "Unable to edit deadline." }]
  }, 500);

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-deadline-at]').attr('datetime'), '2018-12-01T22:00:00.000Z', 'initial deadline');

  await click('[data-test-ea-open]');
  await fillIn('#ticket-deadline', '20/03/2100');
  await click('[data-test-ea-save]');
  assert.ok(find('.flash-message').length > 0, 'showing alert');

  await click('[data-test-ea-cancel]');
  assert.equal(find('[data-test-deadline-at]').attr('datetime'), '2018-12-01T22:00:00.000Z',  'deadline is rolled back');
});