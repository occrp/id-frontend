import { currentURL, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | Expense listing', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);

  test('redirects to the ticket for users', async function(assert) {
    assert.expect(1);
    initSession();

    let ticket = server.create('ticket');

    await visit(`/view/${ticket.id}/expenses`);

    assert.equal(currentURL(), `/view/${ticket.id}`);
  });

  test('shows all', async function(assert) {
    assert.expect(2);

    initSession({ isStaff: true });

    let ticket = server.create('ticket');
    let expenses = server.createList('expense', 2, { ticket });

    await visit(`/view/${ticket.id}/expenses`);

    assert.equal(currentURL(), `/view/${ticket.id}/expenses`);

    assert.equal(find('tbody td a').textContent, expenses[0].scope);
  });
});
