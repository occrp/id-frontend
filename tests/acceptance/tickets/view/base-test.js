import { currentURL, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | tickets/view - base', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);

  test('rendering ticket details (person)', async function(assert) {
    assert.expect(4);
    initSession();

    let ticket = server.create('ticket', {
      kind: 'person_ownership',
      firstName: 'John',
      lastName: 'Doe',
      background: 'Lorem ipsum some background.',
      bornAt: '2004-12-02T00:00:00.000Z',
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(currentURL(), `/view/${ticket.id}`);

    assert.equal(find('[data-test-name]').textContent, 'John Doe');
    assert.equal(find('[data-test-background]').textContent, 'Lorem ipsum some background.');
    assert.equal(find('[data-test-born-at]').textContent, 'December 2, 2004');
  });


  test('rendering ticket details (company)', async function(assert) {
    assert.expect(4);
    initSession();

    let ticket = server.create('ticket', {
      kind: 'company_ownership',
      companyName: 'Acme Inc.',
      country: 'BA',
      background: 'Lorem ipsum some comapny background.',
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(currentURL(), `/view/${ticket.id}`);

    assert.equal(find('[data-test-name]').textContent, 'Acme Inc.');
    assert.equal(find('[data-test-country]').textContent, 'Bosnia and Herzegovina');
    assert.equal(find('[data-test-background]').textContent, 'Lorem ipsum some comapny background.');
  });


  test('rendering ticket details (other)', async function(assert) {
    assert.expect(2);
    initSession();

    let ticket = server.create('ticket', {
      kind: 'other',
      background: 'My question.'
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(currentURL(), `/view/${ticket.id}`);

    assert.equal(find('[data-test-background]').textContent, 'My question.');
  });

  test('on route errors, the error template is shown', async function(assert) {
    assert.expect(1);
    initSession();

    // still need something in the db apparently
    server.create('ticket', {
      id: 1,
      kind: 'other',
      background: 'My question.'
    });

    server.get('/tickets/:id', {
      errors: [{ detail: "Main model error." }]
    }, 500);

    // await assert.asyncThrows(() => {
    //   return visit(`/view/1`);
    // }, `GET ${server.namespace}/tickets/1 returned a 500`);
    await visit(`/view/1`);

    assert.ok(find('[data-test-error-template]'));
  });
});