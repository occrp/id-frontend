import { click, fillIn, findAll, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

module('Acceptance | tickets/view - subscribers', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('(staff) add subscribers to the ticket', async function(assert) {
    assert.expect(5);

    initSession({ isStaff: true });

    server.create('profile', {
      id: 10,
      firstName: 'Subscriber',
      lastName: 'Doe',
      email: 'sub@mail.com'
    });

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    let done = assert.async();
    server.post('/subscribers', function (schema, request) {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs, {
        "data": {
          "attributes": {
            "created-at": null,
            "updated-at": null,
            "email": "sub@mail.com"
          },
          "relationships": {
            "ticket": {
              "data": {
                "id": `${ticket.id}`,
                "type": "tickets"
              }
            }
          },
          "type": "subscribers"
        }
      });

      done();

      let profile = schema.profiles.findBy({ email: attrs.data.attributes['email'] });

      return schema.subscribers.create(Object.assign(this.normalizedRequestAttrs(), {
        user: profile
      }));
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-subscriber]').length, 0);

    await fillIn('#subscriber-email', 'this.is.not.an.email');
    await click('[data-test-add-subscriber]');
    assert.ok(find('#subscriber-email').closest('.formGroup').classList.contains('is-invalid'), 'invalid email shows error');

    await fillIn('#subscriber-email', 'sub@mail.com');
    await click('[data-test-add-subscriber]');

    assert.equal(findAll('[data-test-subscriber]').length, 1);
    assert.equal(find('[data-test-subscriber="1"] [data-test-el-item]').textContent.trim(), 'Subscriber Doe', 'user is subscribed');
  });

  test('(staff) add external subscribers to the ticket', async function(assert) {
    assert.expect(4);

    initSession({ isStaff: true });

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    let done = assert.async();
    server.post('/subscribers', function (schema, request) {
      let attrs = JSON.parse(request.requestBody);

      assert.deepEqual(attrs, {
        "data": {
          "attributes": {
            "created-at": null,
            "updated-at": null,
            "email": "sub@mail.com"
          },
          "relationships": {
            "ticket": {
              "data": {
                "id": `${ticket.id}`,
                "type": "tickets"
              }
            }
          },
          "type": "subscribers"
        }
      });

      done();

      return schema.subscribers.create(this.normalizedRequestAttrs());
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-subscriber]').length, 0);

    await fillIn('#subscriber-email', 'sub@mail.com');
    await click('[data-test-add-subscriber]');

    assert.equal(findAll('[data-test-subscriber]').length, 1);
    assert.equal(find('[data-test-subscriber="1"] [data-test-el-item]').textContent.trim(), 'sub@mail.com', 'external email is subscribed');
  });

  test('(staff) if adding subscribers errors, a message is displayed', async function(assert) {
    assert.expect(3);

    initSession({ isStaff: true });

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    server.post('/subscribers', {
      errors: [{ detail: "Unable to add subscriber." }]
    }, 500);

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-subscriber]').length, 0);

    await fillIn('#subscriber-email', 'sub@mail.com');
    await click('[data-test-add-subscriber]');

    assert.equal(findAll('[data-test-subscriber]').length, 0);
    assert.ok(find('.flash-message'), 'showing alert');
  });


  test('(staff) remove subscribers from ticket', async function(assert) {
    assert.expect(5);

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    let profiles = server.createList('profile', 3, {
      id(i) { return 10 + i },
      firstName(i) { return `John #${10 + i}`; },
      lastName: 'Doe',
    });

    profiles.forEach(profile => {
      server.create('subscriber', {
        id() { return parseInt(profile.id) + 10 },
        ticket,
        user: profile
      });
    })

    initSession({ isStaff: true });

    let done = assert.async();
    server.del('/subscribers/:id', function (schema, request) {
      assert.equal(request.params.id, 21);
      done();

      schema.subscribers.find(request.params.id).destroy();
    });

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-subscriber]').length, 3);
    assert.equal(find('[data-test-subscriber="21"] [data-test-el-item]').textContent.trim(), 'John #11 Doe', 'target user is subscribed');

    await click(find('[data-test-subscriber="21"] [data-test-el-remove]'));

    assert.equal(findAll('[data-test-subscriber]').length, 2);
    assert.equal(find('[data-test-subscriber="21"]'), null, 'target user is unsubscribed');
  });


  test('(staff) if unsubscribing users errors, a message is displayed', async function(assert) {
    assert.expect(3);
    initSession({ isStaff: true });

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    server.create('subscriber', {
      ticket,
      user: server.create('profile')
    });

    server.del('/subscribers/:id', {
      errors: [{ detail: "Unable to unsubscribe user." }]
    }, 500);

    await visit(`/view/${ticket.id}`);

    assert.equal(findAll('[data-test-subscriber]').length, 1);

    await click(find('[data-test-subscriber] [data-test-el-remove]'));

    assert.equal(findAll('[data-test-subscriber]').length, 1, 'user remains subscribed');
    assert.ok(find('.flash-message'), 'showing alert');
  });


  test('current user can unsubscribe from ticket', async function(assert) {
    assert.expect(2);
    let currentUser = initSession();

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    server.create('subscriber', {
      ticket,
      user: currentUser
    });

    let done = assert.async();
    server.del('/subscribers/:id', function (schema, request) {
      done();
      schema.subscribers.find(request.params.id).destroy();
    });

    await visit(`/view/${ticket.id}`);

    assert.ok(find('[data-test-unsubscribe-self]'));

    await click('[data-test-unsubscribe-self]');

    assert.equal(find('[data-test-unsubscribe-self]'), null);
  });
});