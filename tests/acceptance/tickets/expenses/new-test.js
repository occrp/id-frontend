import { click, fillIn, currentURL, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | Expense creation', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);

  test('redirects to the ticket for users', async function(assert) {
    assert.expect(1);
    initSession();

    let ticket = server.create('ticket');

    await visit(`/view/${ticket.id}/expenses/new`);

    assert.equal(currentURL(), `/view/${ticket.id}`);
  });

  test('expense creation', async function(assert) {
    assert.expect(4);

    let user = initSession({ isSuperuser: true });
    let ticket = server.create('ticket');
    let done = assert.async();

    server.post('/expenses', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs, {
        "data": {
          "attributes": {
            "scope": "data.occrp.org",
            "rating": 3,
            "amount": 1.23,
            "amount-currency": "USD",
            "payment-method": "wire",
            "notes": "Worked",
            "created-at": "2020-03-30T00:00:00.000Z",
            "updated-at": null
          },
          "relationships": {
            "ticket": { "data": { "id": ticket.id, "type": 'tickets' } },
            "user": { "data": { "id": user.id, "type": 'profiles' } }
          },
          "type": "expenses"
        }
      });

      done();
      return schema.expenses.create(Object.assign({}, attrs, {
        createdAt: (new Date()).toISOString(),
        updatedAt: (new Date()).toISOString()
      }));
    });

    await visit(`/view/${ticket.id}/expenses`);
    await click('[data-test-new]');

    assert.equal(currentURL(), `/view/${ticket.id}/expenses/new`);

    await fillIn('#expense-scope', 'data.occrp.org');
    await fillIn('#expense-rating', 3);

    await click('[data-test-extra]');

    await fillIn('#expense-date', '30/03/2020');
    await fillIn('#expense-amount', 1.23);
    await fillIn('#expense-method', 'wire');
    await fillIn('#expense-notes', 'Worked');

    await click('[data-test-save]');

    assert.equal(currentURL(), `/view/${ticket.id}/expenses/1`);
    assert.equal(find('#expense-scope').value, 'data.occrp.org');
  });
});
