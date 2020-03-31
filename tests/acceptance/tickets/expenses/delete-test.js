import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | Expense deletion', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);

  test('deletes the record', async function(assert) {
    assert.expect(4);

    initSession({ isSuperuser: true });

    let ticket = server.create('ticket');
    let expenses = server.createList('expense', 2, { ticket });
    let done = assert.async();

    server.del('/expenses/:id', function (schema, request) {
      assert.equal(request.params.id, expenses[0].id);
      done();

      schema.expenses.find(request.params.id).destroy();
    });

    await visit(`/view/${ticket.id}/expenses`);

    assert.equal(currentURL(), `/view/${ticket.id}/expenses`);

    await click('tbody td a');

    assert.equal(currentURL(), `/view/${ticket.id}/expenses/${expenses[0].id}`);

    await click('[data-test-delete]');

    assert.equal(currentURL(), `/view/${ticket.id}/expenses`);
  });
});
