import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | tickets/view - activities');

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

  assert.equal(find('[data-test-activity]').length, 8, 'rendering initial activities');

  await fillIn('#new-comment', 'This is my new comment');
  await click('[data-test-publish-comment]');

  assert.equal(find('[data-test-activity]').length, 9, 'rendering updated activities');

  let $latest = find('[data-test-activity]:last [data-test-activity-body]');
  assert.equal($latest.text().trim(), 'This is my new comment', 'last activity is the new comment');
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

  assert.equal(find('[data-test-activity]').length, 0, 'no activities rendered');
  assert.ok(find('[data-test-activity-error]').length > 0, 'showing alert');
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

  assert.equal(find('[data-test-activity]').length, 2, 'initial activities rendered');

  await fillIn('#new-comment', 'This is my new comment');

  await assert.asyncThrows(() => {
    return click('[data-test-publish-comment]');
  }, `POST ${server.namespace}/comments returned a 500`);


  assert.equal(find('[data-test-activity]').length, 2, 'no new activities show up');
  assert.ok(find('[data-test-comment-error]').length > 0, 'showing alert');
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

  assert.equal(find('[data-test-activity]').length, 50, 'rendering page 1');

  await click('[data-test-pagination="next"]');

  assert.equal(find('[data-test-activity]').length, 20, 'rendering page 2');

  await fillIn('#new-comment', 'This is my new comment');
  await click('[data-test-publish-comment]');

  assert.equal(find('[data-test-activity]').length, 50, 'rendering updated activities');

  let $latest = find('[data-test-activity]:last [data-test-activity-body]');
  assert.equal($latest.text().trim(), 'This is my new comment', 'last activity is the new comment');
});

