import { test } from 'qunit';
import moduleForAcceptance from 'id2-frontend/tests/helpers/module-for-acceptance';

import { faker } from 'ember-cli-mirage';
const random = faker.random.arrayElement;

moduleForAcceptance('Acceptance | tickets/browse');

test('rendering tickets index', function(assert) {
  assert.expect(4);

  server.createList('ticket', 10, 'isPerson', {
    status(i) {
      return i < 7 ? random(['new', 'in-progress']) : random(['closed', 'cancelled']);
    }
  });

  visit('/view');

  andThen(function() {
    assert.equal(currentURL(), '/view');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 7, 'by default showing open tickets');
  });

  click('[data-test-status-tab="closed"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?status=closed');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 3, 'showing closed tickets');
  });
});


test('tickets can be paged', function(assert) {
  assert.expect(4);

  server.createList('ticket', 70, {
    status(i) { return i < 40 ? 'new' : 'closed'; },
    kind: 'person_ownership',
    firstName: 'John',
    lastName(i) { return `Doe ${i + 1}`; },
  });

  visit('/view');

  andThen(() => {
    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 25, 'showing first page tickets');
  });

  click('[data-test-pagination="next"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?page=2');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 15, 'showing 2nd page tickets');

    let $firstItemName = $items.eq(0).find('[data-test-ticket-name]');
    assert.equal($firstItemName.text().trim(), 'John Doe 26');
  });
});


test('tickets can be filtered by kind', function(assert) {
  assert.expect(3);

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

  visit('/view');

  andThen(() => {
    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 10, 'showing unfiltered tickets');
  });

  click('[data-test-dd="filter-kind"] [data-test-dd-trigger]');
  click('[data-test-kind-option="person_ownership"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?kind=person_ownership');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 4, 'showing person ownership tickets');
  });
});


test('tickets can be filtered by author', function(assert) {
  assert.expect(5);

  server.createList('user', 5, {
    firstName(i) { return `User #${i+1}`; },
    lastName: 'Doe'
  });
  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    authorId(i) { return i < 2 ? 1 : 4; }
  });

  server.get('/tickets', (schema, request) => {
    let authorId = request.queryParams['filter[author]'];

    if (authorId) {
      let user = schema.users.find(authorId);

      request.mirageMeta = {
        filters: {
          author: {
            'first-name': user.firstName,
            'last-name': user.lastName
          }
        }
      };

      return schema.tickets.where({ authorId: authorId });
    }

    return schema.tickets.all();
  });

  visit('/view');

  andThen(() => {
    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 10, 'showing unfiltered tickets');
  });

  click('[data-test-dd="filter-author"] [data-test-dd-trigger]');
  fillIn('[data-test-filter-search]', 'User #4');

  andThen(() => {
    assert.equal(find('[data-test-filter-option]:first').text(), 'User #4 Doe');
  });

  click('[data-test-filter-option]:first');

  andThen(() => {
    assert.equal(currentURL(), '/view?author=4');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 8, 'showing user #4 tickets');

    assert.equal(find('[data-test-active-filter="author"]').text(), 'User #4 Doe');
  });
});


test('tickets can be filtered by assignee', function(assert) {
  assert.expect(8);

  server.createList('user', 5, 'staff', {
    firstName(i) { return `Staff #${i+1}`; },
    lastName: 'Doe'
  });
  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    assigneeId(i) { return i < 4 ? 2 : null; }
  });

  server.get('/tickets', (schema, request) => {
    let assigneeId = request.queryParams['filter[assignee]'];

    if (assigneeId === 'none') {
      return schema.tickets.where({ assigneeId: null });
    }

    if (assigneeId) {
      let user = schema.users.find(assigneeId);

      request.mirageMeta = {
        filters: {
          assignee: {
            'first-name': user.firstName,
            'last-name': user.lastName
          }
        }
      };

      return schema.tickets.where({ assigneeId: assigneeId });
    }

    return schema.tickets.all();
  });

  visit('/view');

  andThen(() => {
    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 10, 'showing unfiltered tickets');
  });

  click('[data-test-dd="filter-assignee"] [data-test-dd-trigger]');
  click('[data-test-filter-static-option="none"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?assignee=none');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 6, 'showing unassigned tickets');

    assert.equal(find('[data-test-active-filter="assignee"]').text().trim(), 'none');
  });

  click('[data-test-dd="filter-assignee"] [data-test-dd-trigger]');
  fillIn('[data-test-filter-search]', 'Staff #2');

  andThen(() => {
    assert.equal(find('[data-test-filter-option]:first').text(), 'Staff #2 Doe');
  });

  click('[data-test-filter-option]:first');

  andThen(() => {
    assert.equal(currentURL(), '/view?assignee=2');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 4, 'showing tickets assigned to user #2');

    assert.equal(find('[data-test-active-filter="assignee"]').text(), 'Staff #2 Doe');
  });
});


test('tickets can sorted', function(assert) {
  assert.expect(1);

  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe'
  });

  visit('/view');

  click('[data-test-dd="sort"] [data-test-dd-trigger]');
  click('[data-test-sort-option="-deadline-at"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?sort=-deadline-at');
  });
});


test('ticket filtering or sorting should reset pagination', function(assert) {
  assert.expect(8);

  server.createList('user', 5, {
    firstName(i) { return `User #${i+1}`; },
    lastName: 'Doe'
  });
  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    authorId: 4,
    assigneeId: null
  });

  visit('/view?size=3');

  click('[data-test-pagination="next"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?page=2&size=3');
  });

  click('[data-test-dd="filter-author"] [data-test-dd-trigger]');
  click('[data-test-filter-option="4"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?author=4&size=3');
  });

  click('[data-test-pagination="next"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?author=4&page=2&size=3');
  });

  click('[data-test-dd="filter-assignee"] [data-test-dd-trigger]');
  click('[data-test-filter-static-option="none"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?assignee=none&author=4&size=3');
  });

  click('[data-test-pagination="next"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?assignee=none&author=4&page=2&size=3');
  });

  click('[data-test-dd="filter-kind"] [data-test-dd-trigger]');
  click('[data-test-kind-option="person_ownership"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?assignee=none&author=4&kind=person_ownership&size=3');
  });

  click('[data-test-pagination="next"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?assignee=none&author=4&kind=person_ownership&page=2&size=3');
  });

  click('[data-test-dd="sort"] [data-test-dd-trigger]');
  click('[data-test-sort-option="-deadline-at"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?assignee=none&author=4&kind=person_ownership&size=3&sort=-deadline-at');
  });
});
