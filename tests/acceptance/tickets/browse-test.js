import { test } from 'qunit';
import moduleForAcceptance from 'id2-frontend/tests/helpers/module-for-acceptance';

import { faker } from 'ember-cli-mirage';
const random = faker.random.arrayElement;

moduleForAcceptance('Acceptance | tickets/browse');

test('rendering tickets index', async function(assert) {
  assert.expect(4);
  initSession();

  server.createList('ticket', 10, 'isPerson', {
    status(i) {
      return i < 7 ? random(['new', 'in-progress']) : random(['closed', 'cancelled']);
    }
  });

  await visit('/view');

  assert.equal(currentURL(), '/view');

  let $items = find('[data-test-ticket]');
  assert.equal($items.length, 7, 'by default showing open tickets');

  await click('[data-test-status-tab="closed"]');

  assert.equal(currentURL(), `/view?status=${encodeURIComponent('closed,cancelled')}`);

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 3, 'showing closed tickets');
});


test('tickets can be paged', async function(assert) {
  assert.expect(4);
  initSession();

  server.createList('ticket', 70, {
    status(i) { return i < 40 ? 'new' : 'closed'; },
    kind: 'person_ownership',
    firstName: 'John',
    lastName(i) { return `Doe ${i + 1}`; },
  });

  await visit('/view');

  let $items = find('[data-test-ticket]');
  assert.equal($items.length, 25, 'showing first page tickets');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?page=2');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 15, 'showing 2nd page tickets');

  let $firstItemName = $items.eq(0).find('[data-test-ticket-name]');
  assert.equal($firstItemName.text().trim(), 'John Doe 26');
});


test('(staff) tickets can be filtered by kind', async function(assert) {
  assert.expect(3);
  initSession({ isStaff: true});

  server.createList('ticket', 10, {
    status: 'new',
    kind(i) { return i < 4 ? 'person_ownership' : random(['company_ownership'], ['other']); }
  });

  server.get('/tickets', (schema, request) => {
    let kind = request.queryParams['filter[kind]'];

    if (kind) {
      return schema.tickets.where({ kind: kind });
    }

    return schema.tickets.all();
  });

  await visit('/view');

  let $items = find('[data-test-ticket]');
  assert.equal($items.length, 10, 'showing unfiltered tickets');

  await click('[data-test-dd="filter-kind"] [data-test-dd-trigger]');
  await click('[data-test-kind-option="person_ownership"]');

  assert.equal(currentURL(), '/view?kind=person_ownership');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 4, 'showing person ownership tickets');
});


test('(staff) tickets can be filtered by requester', async function(assert) {
  assert.expect(6);

  server.createList('profile', 5, {
    firstName(i) { return `User #${i+1}`; },
    lastName: 'Doe'
  });

  initSession({ isStaff: true });

  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    requesterId(i) { return i < 2 ? 1 : 4; }
  });

  server.get('/tickets', (schema, request) => {
    let requesterId = request.queryParams['filter[requester]'];

    if (requesterId) {
      let profile = schema.profiles.find(requesterId);

      request.mirageMeta = {
        filters: {
          requester: {
            'first-name': profile.firstName,
            'last-name': profile.lastName
          }
        }
      };

      return schema.tickets.where({ requesterId: requesterId });
    }

    return schema.tickets.all();
  });

  await visit('/view');

  let $items = find('[data-test-ticket]');
  assert.equal($items.length, 10, 'showing unfiltered tickets');

  await click('[data-test-dd="filter-requester"] [data-test-dd-trigger]');
  await fillIn('[data-test-filter-search]', 'User #4');

  assert.equal(find('[data-test-filter-option]:first').text(), 'User #4 Doe');

  await click('[data-test-filter-option]:first');

  assert.equal(currentURL(), '/view?requester=4');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 8, 'showing user #4 tickets');

  assert.equal(find('[data-test-active-filter="requester"]').text(), 'User #4 Doe');

  await click('[data-test-dd="filter-requester"] [data-test-dd-trigger]');

  assert.ok(find('[data-test-filter-option]:contains("User #4 Doe")').hasClass('is-active'));
});


test('(staff) tickets can be filtered by responder', async function(assert) {
  assert.expect(9);

  server.createList('profile', 5, 'staff', {
    firstName(i) { return `Staff #${i+1}`; },
    lastName: 'Doe'
  });

  initSession({ isStaff: true });

  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    responderId(i) { return i < 4 ? 2 : null; }
  });

  server.get('/tickets', (schema, request) => {
    let responderId = request.queryParams['filter[responders]'];

    if (responderId === 'none') {
      return schema.tickets.where({ responderId: null });
    }

    if (responderId) {
      let profile = schema.profiles.find(responderId);

      request.mirageMeta = {
        filters: {
          responders: {
            'first-name': profile.firstName,
            'last-name': profile.lastName
          }
        }
      };

      return schema.tickets.where({ responderId: responderId });
    }

    return schema.tickets.all();
  });

  await visit('/view');

  let $items = find('[data-test-ticket]');
  assert.equal($items.length, 10, 'showing unfiltered tickets');

  await click('[data-test-dd="filter-responder"] [data-test-dd-trigger]');
  await click('[data-test-filter-static-option="none"]');

  assert.equal(currentURL(), '/view?responders=none');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 6, 'showing unassigned tickets');

  assert.equal(find('[data-test-active-filter="responder"]').text().trim(), 'No one assigned');

  await click('[data-test-dd="filter-responder"] [data-test-dd-trigger]');
  await fillIn('[data-test-filter-search]', 'Staff #2');

  assert.equal(find('[data-test-filter-option]:first').text(), 'Staff #2 Doe');

  await click('[data-test-filter-option]:first');

  assert.equal(currentURL(), '/view?responders=2');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 4, 'showing tickets assigned to user #2');

  assert.equal(find('[data-test-active-filter="responder"]').text(), 'Staff #2 Doe');

  await click('[data-test-dd="filter-responder"] [data-test-dd-trigger]');

  assert.ok(find('[data-test-filter-option]:contains("Staff #2 Doe")').hasClass('is-active'));
});


test('tickets can sorted', async function(assert) {
  assert.expect(1);
  initSession();

  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe'
  });

  await visit('/view');

  await click('[data-test-dd="sort"] [data-test-dd-trigger]');
  await click('[data-test-sort-option="-deadline-at"]');

  assert.equal(currentURL(), '/view?sort=-deadline-at');
});


test('(staff) ticket filtering or sorting should reset pagination', async function(assert) {
  assert.expect(8);

  server.createList('profile', 5, {
    firstName(i) { return `User #${i+1}`; },
    lastName: 'Doe'
  });

  initSession({ isStaff: true });

  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    requesterId: 4,
    responderId: null
  });

  await visit('/view?size=3');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?page=2&size=3');

  await click('[data-test-dd="filter-requester"] [data-test-dd-trigger]');
  await click('[data-test-filter-option="4"]');

  assert.equal(currentURL(), '/view?requester=4&size=3');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?page=2&requester=4&size=3');

  await click('[data-test-dd="filter-responder"] [data-test-dd-trigger]');
  await click('[data-test-filter-static-option="none"]');

  assert.equal(currentURL(), '/view?requester=4&responders=none&size=3');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?page=2&requester=4&responders=none&size=3');

  await click('[data-test-dd="filter-kind"] [data-test-dd-trigger]');
  await click('[data-test-kind-option="person_ownership"]');

  assert.equal(currentURL(), '/view?kind=person_ownership&requester=4&responders=none&size=3');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?kind=person_ownership&page=2&requester=4&responders=none&size=3');

  await click('[data-test-dd="sort"] [data-test-dd-trigger]');
  await click('[data-test-sort-option="-deadline-at"]');

  assert.equal(currentURL(), '/view?kind=person_ownership&requester=4&responders=none&size=3&sort=-deadline-at');
});
