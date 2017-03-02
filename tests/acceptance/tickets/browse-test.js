import { test } from 'qunit';
import moduleForAcceptance from 'id2-frontend/tests/helpers/module-for-acceptance';

import { faker } from 'ember-cli-mirage';
const random = faker.random.arrayElement;

moduleForAcceptance('Acceptance | tickets/browse');

test('rendering tickets index', function(assert) {
  assert.expect(4);

  server.createList('ticket', 10, {
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
  assert.expect(5);

  server.createList('ticket', 70, {
    status(i) { return i < 40 ? 'new' : 'closed'; },
    type: 'person_ownership',
    name: 'John',
    surname(i) { return `Doe ${i + 1}`; },
  });

  visit('/view');

  andThen(() => {
    assert.equal(currentURL(), '/view');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 25, 'showing first page tickets');
  });

  click('[data-test-pagination="next"]');

  andThen(() => {
    assert.equal(currentURL(), '/view?page=2');

    let $items = find('[data-test-ticket]');
    assert.equal($items.length, 15, 'showing 2nd page tickets');

    let $firstItemName = $items.eq(0).find('[data-test-ticket-name]');
    assert.equal($firstItemName.text(), 'John Doe 26');
  });

});
