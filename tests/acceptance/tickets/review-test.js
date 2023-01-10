import { click, fillIn, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Review creation', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);

  test('review creation', async function(assert) {
    assert.expect(2);

    let ticket = server.create('ticket');
    let done = assert.async();

    server.post('/reviews', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs, {
        "data": {
          "attributes": {
            "rating": 2,
            "link": "https://occrp.org",
            "token": "<TOKEN>",
            "body": "Worked",
            "created-at": null
          },
          "relationships": {
            "ticket": { "data": { "id": ticket.id, "type": 'tickets' } },
          },
          "type": "reviews"
        }
      });

      done();
      return schema.reviews.create(Object.assign({}, attrs, {
        createdAt: (new Date()).toISOString()
      }));
    });

    await visit(`/view/${ticket.id}/review?token=<TOKEN>`);

    await click('[data-test-yes]');
    await fillIn('#review-link', 'https://occrp.org');
    await fillIn('#review-body', 'Worked');

    await click('[data-test-save]');

    assert.ok(find('#thankyou'));
  });
});
