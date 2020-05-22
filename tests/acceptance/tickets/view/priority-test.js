import { click, fillIn, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | tickets/view - priority', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('(staff) changes priority of the ticket', async function(assert) {
    assert.expect(3);

    initSession({ isSuperuser: true });

    let ticket = server.create('ticket', { priority: 'default' });

    let done = assert.async();
    server.patch('/tickets/:id', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs.data.attributes.priority, 'high');

      done();

      return ticket.update(attrs.data.attributes);
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(find('#ticket-priority').value, 'default');

    await fillIn('#ticket-priority', 'high');
    await click('[data-test-save-priority]');

    assert.equal(find('#ticket-priority').value, 'high');
  });

  test('(staff) on ticket priority error, a message is displayed', async function(assert) {
    assert.expect(1);
    initSession({ isSuperuser: true });

    let ticket = server.create('ticket', { priority: 'low' });

    server.patch('/tickets/:id', {
      errors: [{ detail: "Unable to edit countries." }]
    }, 500);

    await visit(`/view/${ticket.id}`);

    await fillIn('#ticket-priority', 'high');
    await click('[data-test-save-priority]');

    assert.ok(find('.flash-message'), 'showing alert');
  });
});
