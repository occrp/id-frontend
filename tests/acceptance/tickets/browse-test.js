import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

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


test('(admins) tickets can be filtered by kind', async function(assert) {
  assert.expect(3);
  initSession({ isSuperuser: true });

  server.createList('ticket', 10, {
    status: 'new',
    kind(i) { return i < 4 ? 'person_ownership' : random(['company_ownership'], ['other']); }
  });

  server.get('/tickets', (schema, request) => {
    request.mirageMeta = {
      total: {
        'all': schema.tickets.all().length,
      },
    };

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


test('(admins) tickets can be filtered by country', async function(assert) {
  assert.expect(6);
  initSession({ isSuperuser: true });

  server.createList('ticket', 2, 'isPerson', {
    status: 'new',
  });
  server.createList('ticket', 1, 'isPerson', {
    status: 'new',
    country: 'AD'
  });
  server.createList('ticket', 2, 'isCompany', {
    status: 'new',
    country: 'GB'
  });
  server.createList('ticket', 2, 'isCompany', {
    status: 'new',
    country: 'AD'
  });
  server.createList('ticket', 5, 'isOther', {
    status: 'new',
  });

  server.get('/tickets', (schema, request) => {
    request.mirageMeta = {
      total: {
        'all': schema.tickets.all().length,
      },
    };

    let kind = request.queryParams['filter[kind]'];
    let country = request.queryParams['filter[country]'];
    let filters = {};

    if (kind) {
      filters.kind = kind;
    }

    if (country) {
      filters.country = country;
    }

    return schema.tickets.where(filters);
  });

  await visit('/view');

  let $items = find('[data-test-ticket]');
  assert.equal($items.length, 12, 'showing unfiltered tickets');

  await click('[data-test-dd="filter-country"] [data-test-dd-trigger]');
  await fillIn('[data-test-filter-search]', 'and');

  assert.equal(find('[data-test-search-result]:first').attr('data-test-search-result'), 'AD');

  await click('[data-test-search-result]:first');

  assert.equal(currentURL(), '/view?country=AD');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 3, 'showing companies registered in Andorra');

  assert.equal(find('[data-test-active-filter="country"]').text(), 'AD');

  await click('[data-test-dd="filter-country"] [data-test-dd-trigger]');
  await fillIn('[data-test-filter-search]', 'and');

  assert.ok(find('[data-test-search-result="AD"]').hasClass('is-active'));
});


test('(admins) tickets can be filtered by requester', async function(assert) {
  assert.expect(6);

  server.createList('profile', 5, {
    firstName(i) { return `User #${i+1}`; },
    lastName: 'Doe'
  });

  initSession({ isSuperuser: true });

  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    requesterId(i) { return i < 2 ? 1 : 4; }
  });

  server.get('/tickets', (schema, request) => {
    request.mirageMeta = {
      total: {
        'all': schema.tickets.all().length,
      },
    };

    let requesterId = request.queryParams['filter[requester]'];

    if (requesterId) {
      let profile = schema.profiles.find(requesterId);

      request.mirageMeta.filters = {
        requester: {
          'first-name': profile.firstName,
          'last-name': profile.lastName
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

  assert.equal(find('[data-test-search-result]:first').text(), 'User #4 Doe');

  await click('[data-test-search-result]:first');

  assert.equal(currentURL(), '/view?requester=4');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 8, 'showing user #4 tickets');

  assert.equal(find('[data-test-active-filter="requester"]').text(), 'User #4 Doe');

  await click('[data-test-dd="filter-requester"] [data-test-dd-trigger]');

  assert.ok(find('[data-test-search-result]:contains("User #4 Doe")').hasClass('is-active'));
});


test('(admins) tickets can be filtered by responder', async function(assert) {
  assert.expect(9);

  server.createList('profile', 5, 'staff', {
    firstName(i) { return `Staff #${i+1}`; },
    lastName: 'Doe'
  });

  initSession({ isSuperuser: true });

  server.createList('ticket', 10, {
    status: 'new',
    kind: 'person_ownership',
    firstName(i) { return `Ticket #${i+1}`; },
    lastName: 'Doe',
    responderId(i) { return i < 4 ? 2 : null; }
  });

  server.get('/tickets', (schema, request) => {
    request.mirageMeta = {
      total: {
        'all': schema.tickets.all().length,
      },
    };

    let responderId = request.queryParams['filter[responders__user]'];

    // used to be on responderId. see adapter
    let isNone = request.queryParams['filter[responders__user__isnull]'];

    if (isNone !== undefined) {
      return schema.tickets.where({ responderId: null });
    }

    if (responderId) {
      let profile = schema.profiles.find(responderId);

      request.mirageMeta.filters = {
        responder: {
          'first-name': profile.firstName,
          'last-name': profile.lastName
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

  assert.equal(currentURL(), '/view?responder=none');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 6, 'showing unassigned tickets');

  assert.equal(find('[data-test-active-filter="responder"]').text().trim(), 'No one assigned');

  await click('[data-test-dd="filter-responder"] [data-test-dd-trigger]');
  await fillIn('[data-test-filter-search]', 'Staff #2');

  assert.equal(find('[data-test-search-result]:first').text(), 'Staff #2 Doe');

  await click('[data-test-search-result]:first');

  assert.equal(currentURL(), '/view?responder=2');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 4, 'showing tickets assigned to user #2');

  assert.equal(find('[data-test-active-filter="responder"]').text(), 'Staff #2 Doe');

  await click('[data-test-dd="filter-responder"] [data-test-dd-trigger]');

  assert.ok(find('[data-test-search-result]:contains("Staff #2 Doe")').hasClass('is-active'));
});


test('(staff) ticket filters can be removed', async function(assert) {
  assert.expect(9);
  initSession({ isStaff: true });

  server.createList('ticket', 10, {
    status: 'new',
    kind(i) { return i < 4 ? 'person_ownership' : random(['company_ownership'], ['other']); },
    country(i) { return i === 1 ? 'GB' : 'AD' }
  });

  server.get('/tickets', (schema, request) => {
    request.mirageMeta = {
      total: {
        'all': schema.tickets.all().length,
      },
    };

    let kind = request.queryParams['filter[kind]'];
    let country = request.queryParams['filter[country]'];
    let filters = {};

    if (kind) {
      filters.kind = kind;
    }

    if (country) {
      filters.country = country;
    }

    return schema.tickets.where(filters);
  });

  await visit('/view');

  let $items = find('[data-test-ticket]');
  assert.equal($items.length, 10, 'showing unfiltered tickets');

  await click('[data-test-dd="filter-kind"] [data-test-dd-trigger]');
  await click('[data-test-kind-option="person_ownership"]');
  await click('[data-test-dd="filter-country"] [data-test-dd-trigger]');
  await fillIn('[data-test-filter-search]', 'and');
  await click('[data-test-search-result]:first');

  assert.equal(currentURL(), '/view?country=AD&kind=person_ownership');

  $items = find('[data-test-ticket]');
  assert.equal($items.length, 3, 'showing filtered tickets');

  assert.ok(find('[data-test-active-filter="kind"]').length);
  assert.ok(find('[data-test-active-filter="country"]').length);

  await click('[data-test-remove-filter="kind"]');

  $items = find('[data-test-ticket]');
  assert.equal(currentURL(), '/view?country=AD');
  assert.equal($items.length, 9, 'showing tickets filtered only by country');

  assert.equal(find('[data-test-active-filter="kind"]').length, 0);
  assert.ok(find('[data-test-active-filter="country"]').length);
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


test('(admins) ticket filtering or sorting should reset pagination', async function(assert) {
  assert.expect(8);

  server.createList('profile', 5, {
    firstName(i) { return `User #${i+1}`; },
    lastName: 'Doe'
  });

  initSession({ isSuperuser: true });

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
  await click('[data-test-search-result="4"]');

  assert.equal(currentURL(), '/view?requester=4&size=3');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?page=2&requester=4&size=3');

  await click('[data-test-dd="filter-responder"] [data-test-dd-trigger]');
  await click('[data-test-filter-static-option="none"]');

  assert.equal(currentURL(), '/view?requester=4&responder=none&size=3');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?page=2&requester=4&responder=none&size=3');

  await click('[data-test-dd="filter-kind"] [data-test-dd-trigger]');
  await click('[data-test-kind-option="person_ownership"]');

  assert.equal(currentURL(), '/view?kind=person_ownership&requester=4&responder=none&size=3');

  await click('[data-test-pagination="next"]');

  assert.equal(currentURL(), '/view?kind=person_ownership&page=2&requester=4&responder=none&size=3');

  await click('[data-test-dd="sort"] [data-test-dd-trigger]');
  await click('[data-test-sort-option="-deadline-at"]');

  assert.equal(currentURL(), '/view?kind=person_ownership&requester=4&responder=none&size=3&sort=-deadline-at');
});


test('(admins) can assign responders from the ticket list', async function(assert) {
  assert.expect(8);

  server.createList('profile', 5, {
    firstName(i) { return `Staff #${i+1}`; },
    lastName: 'Doe',
    isStaff: true
  });

  server.create('profile', {
    firstName: 'Author',
    lastName: 'Doe',
    isStaff: false
  });

  initSession({ isSuperuser: true });

  server.createList('ticket', 5, {
    status: 'new',
    kind: 'company_ownership',
    companyName(i) { return `Company #${i+1}`; },
    requesterId: 6,
    responderId: null
  });

  let done = assert.async();
  server.post('/responders', function (schema, request) {
    let attrs = JSON.parse(request.requestBody);

    assert.deepEqual(attrs, {
      "data": {
        "attributes": {
          "created-at": null,
          "updated-at": null
        },
        "relationships": {
          "ticket": {
            "data": {
              "id": "2",
              "type": "tickets"
            }
          },
          "user": {
            "data": {
              "id": "3",
              "type": "profiles"
            }
          }
        },
        "type": "responders"
      }
    });

    done();

    let ticket = schema.tickets.find(2);
    ticket.update('status', 'in-progress');

    let normieAttrs = this.normalizedRequestAttrs();
    return schema.responders.create(normieAttrs);
  });

  await visit('/view');

  let $item = find('[data-test-ticket="2"]');
  assert.equal($item.find('[data-test-ticket-name]').text().trim(), 'Company #2');

  // Status should change to in-progress after the first assignment
  let $status = $item.find('[data-test-ticket-status]');
  assert.equal($status.text().toLowerCase(), 'new');

  let $responders = $item.find('[data-test-ticket-responders]');
  assert.equal($responders.length, 0);

  let $ddTrigger = $item.find('[data-test-dd="quick-assign-responder"] [data-test-dd-trigger]');

  await click($ddTrigger);
  await fillIn('[data-test-filter-search]', 'Staff #3');

  assert.equal(find('[data-test-search-result]:first').text(), 'Staff #3 Doe');
  await click('[data-test-search-result]:first');

  $responders = $item.find('[data-test-ticket-responders]');
  assert.ok($responders.length);
  assert.equal($responders.text(), 'Staff #3 Doe');

  $status = $item.find('[data-test-ticket-status]');
  assert.equal($status.text().toLowerCase(), 'in progress');
});


test('(admins) if assigning responders errors, a message is displayed', async function(assert) {
  assert.expect(3);

  server.createList('profile', 5, {
    firstName(i) { return `Staff #${i+1}`; },
    lastName: 'Doe',
    isStaff: true
  });

  initSession({ isSuperuser: true });

  server.createList('ticket', 5, {
    status: 'new',
    kind: 'company_ownership',
    companyName(i) { return `Company #${i+1}`; },
  });

  server.post('/responders', {
    errors: [{ detail: "Unable to add responder." }]
  }, 500);

  await visit('/view');

  let $item = find('[data-test-ticket="2"]');
  assert.equal($item.find('[data-test-ticket-responders]').length, 0);

  let $ddTrigger = $item.find('[data-test-dd="quick-assign-responder"] [data-test-dd-trigger]');

  await click($ddTrigger);
  await fillIn('[data-test-filter-search]', 'Staff #3');
  await click('[data-test-search-result]:first');

  assert.equal($item.find('[data-test-ticket-responders]').length, 0);
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});


test('on route errors, the error template is shown', async function(assert) {
  assert.expect(2);
  initSession();

  server.createList('ticket', 2, {
    kind: 'other',
    background: 'My question.'
  });

  server.get('/tickets', {
    errors: [{ detail: "Main model error." }]
  }, 500);

  await assert.asyncThrows(() => {
    return visit(`/view`);
  }, `GET ${server.namespace}/tickets returned a 500`);

  assert.ok(find('[data-test-error-template]').length > 0);
});