import { click, fillIn, findAll, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | tickets/view - countries', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('(staff) add countries to the ticket', async function(assert) {
    assert.expect(5);

    initSession({ isSuperuser: true });

    let ticket = server.create('ticket', { countries: ['MD'] });

    let done = assert.async();
    server.patch('/tickets/:id', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs.data.attributes.countries, ['MD', 'RO']);

      done();

      return ticket.update(attrs.data.attributes);
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-countries] a').length, 1);
    assert.equal(find('[data-test-countries] a').textContent.trim(), 'MD');

    await fillIn('#ticket-countries', 'RO');
    // Duplicates won't get through...
    await fillIn('#ticket-countries', 'RO');
    await click('[data-test-add-country]');

    assert.equal(findAll('[data-test-countries] a').length, 2);
    assert.equal(
      findAll('[data-test-countries] a')[1].textContent.trim(),
      'RO',
      'country added'
    );
  });

  test('(staff) remove countries from ticket', async function(assert) {
    assert.expect(4);

    let ticket = server.create('ticket', { countries: ['RO'] });

    initSession({ isSuperuser: true });

    let done = assert.async();
    server.patch('/tickets/:id', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs.data.attributes.countries, []);

      done();

      return ticket.update(attrs.data.attributes);
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-countries] a').length, 1);
    assert.ok(find('[data-test-countries]').textContent.includes('RO'));

    await click(find('[data-test-countries] a'));

    assert.equal(findAll('[data-test-countries] a').length, 0);
  });

  test('current user sees ticket countries', async function(assert) {
    assert.expect(3);
    let currentUser = initSession();

    let ticket = server.create('ticket', {
      requester: currentUser, countries: ['MD', 'RO']
    });

    await visit(`/view/${ticket.id}`);

    assert.ok(findAll('[data-test-countries] span').length, 2);
    assert.equal(findAll('[data-test-countries] span')[0].textContent, 'MD');
    assert.equal(findAll('[data-test-countries] span')[1].textContent, 'RO');
  });
});
