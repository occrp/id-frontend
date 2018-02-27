import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view - base');

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

  assert.equal(find('[data-test-name]').text(), 'John Doe');
  assert.equal(find('[data-test-background]').text(), 'Lorem ipsum some background.');
  assert.equal(find('[data-test-born-at]').text(), 'December 2, 2004');
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

  assert.equal(find('[data-test-name]').text(), 'Acme Inc.');
  assert.equal(find('[data-test-country]').text(), 'Bosnia and Herzegovina');
  assert.equal(find('[data-test-background]').text(), 'Lorem ipsum some comapny background.');
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

  assert.equal(find('[data-test-background]').text(), 'My question.');
});