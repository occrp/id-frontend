import { find, click, fillIn, findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | tickets/view - activities', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);


  test('rendering activities & submitting a comment', async function(assert) {
    assert.expect(4);
    let currentUser = initSession();

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    server.createList('activity', 8, {
      verb: 'comment:create',
      ticket
    });

    let done = assert.async();
    server.post('/comments', function (schema, request) {
      let body = JSON.parse(request.requestBody);

      assert.deepEqual(body, {
        "data": {
          "attributes": {
            "body": "This is my new comment",
            "created-at": null
          },
          "relationships": {
            "ticket": {
              "data": {
                "id": `${ticket.id}`,
                "type": "tickets"
              }
            },
            "user": {
              "data": {
                "id": "42",
                "type": "profiles"
              }
            }
          },
          "type": "comments"
        }
      });
      done();

      let comment = schema.comments.create(Object.assign(this.normalizedRequestAttrs(), {
        createdAt: (new Date()).toISOString()
      }));

      schema.activities.create({
        verb: 'comment:create',
        createdAt: (new Date()).toISOString(),
        ticket,
        user: currentUser,
        comment
      });

      return comment;
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-activity]').length, 8, 'rendering initial activities');

    await fillIn('#new-comment', 'This is my new comment');
    await click('[data-test-publish-comment]');

    assert.equal(findAll('[data-test-activity]').length, 9, 'rendering updated activities');

    let $latest = find('[data-test-activity]:nth-child(9) [data-test-activity-body]');
    assert.equal($latest.textContent.trim(), 'This is my new comment', 'last activity is the new comment');
  });


  test('if loading activities errors, a message is displayed', async function(assert) {
    assert.expect(3);

    initSession();

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    server.get('/activities', {
      errors: [{ detail: "Unable to load activities." }]
    }, 500);

    await assert.asyncThrows(() => {
      return visit(`/view/${ticket.id}`);
    }, `GET ${server.namespace}/activities returned a 500`);

    assert.equal(findAll('[data-test-activity]').length, 0, 'no activities rendered');
    assert.ok(find('[data-test-activity-error]'), 'showing alert');
  });


  test('if submitting a comment errors, a message is displayed', async function(assert) {
    assert.expect(4);

    initSession();

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    server.createList('activity', 2, {
      verb: 'comment:create',
      ticket
    });

    server.post('/comments', {
      errors: [{ detail: "Unable to post comment." }]
    }, 500);

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-activity]').length, 2, 'initial activities rendered');

    await fillIn('#new-comment', 'This is my new comment');

    await assert.asyncThrows(() => {
      return click('[data-test-publish-comment]');
    }, `POST ${server.namespace}/comments returned a 500`);


    assert.equal(findAll('[data-test-activity]').length, 2, 'no new activities show up');
    assert.ok(find('[data-test-comment-error]'), 'showing alert');
  });


  test('activities can be paged, new activity resets pagination', async function(assert) {
    assert.expect(4);
    initSession();

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    // 50 is the hardcoded pagesize
    server.createList('activity', 70, {
      verb: 'comment:create',
      ticket
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-activity]').length, 50, 'rendering page 1');

    await click('[data-test-load-more]');

    assert.equal(findAll('[data-test-activity]').length, 70, 'rendering page 1+2');

    await fillIn('#new-comment', 'This is my new comment');
    await click('[data-test-publish-comment]');

    assert.equal(findAll('[data-test-activity]').length, 71, 'rendering updated activities');

    let $latest = find('[data-test-activity]:nth-child(71) [data-test-activity-body]');
    assert.equal($latest.textContent.trim(), 'This is my new comment', 'last activity is the new comment');
  });
});

