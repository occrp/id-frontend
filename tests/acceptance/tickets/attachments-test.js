import { find, click, findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';

import { selectFiles } from 'ember-file-upload/test-support';
import { upload } from 'ember-file-upload/mirage';

module('Acceptance | tickets/view - attachments', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('uploading a file', async function(assert) {
    assert.expect(5);
    let currentUser = initSession();

    let ticket = server.create('ticket', {
      id: 33,
      status: 'new',
      kind: 'company_ownership',
    });

    let done = assert.async();
    server.post('/attachments', upload(function (schema, request) {
      let file = request.requestBody.upload;
      let meta = JSON.parse(request.requestBody.ticket);

      // extra info required by the server
      assert.deepEqual(meta, {
        "id": "33",
        "type": "tickets"
      });
      done();

      let attachment = schema.attachments.create({
        upload: file.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        createdAt: (new Date()).toISOString(),
        user: currentUser,
        ticket
      });

      schema.activities.create({
        verb: 'attachment:create',
        createdAt: (new Date()).toISOString(),
        ticket,
        user: currentUser,
        attachment
      });

      return attachment;
    }));

    await visit(`/view/${ticket.id}/attachments`);

    assert.equal(findAll('[data-test-attachment]').length, 0, 'no attachments initially');

    let data = new Uint8Array([
      137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
      0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
      173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
      214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
      78,68,174,66,96,130
    ]);

    let photo = new File([data], 'image.png', { type: 'image/png'});
    await selectFiles('[data-test-file-upload] input', photo);

    await click('[data-test-confirm]');

    assert.equal(findAll('[data-test-attachment]').length, 1, 'file was uploaded');
    assert.equal(find('[data-test-attachment]').getAttribute('title'), 'image.png');

    await visit(`/view/${ticket.id}`);

    assert.equal(
      findAll('[data-test-activity=attachment]').length, 1,
      'new activity is rendered'
    );
  });


  test('(admin or author) removing an attachment', async function(assert) {
    assert.expect(6);
    let otherUser = server.create('profile', { firstName: 'Joe' });
    let currentUser = initSession();

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
    });

    // override afterCreate from factory :/
    ticket.update({
      requester: currentUser
    });

    server.createList('attachment', 2, {
      user: otherUser,
      ticket
    });

    server.create('attachment', {
      id: 20,
      user: currentUser,
      ticket
    });

    let done = assert.async();
    server.del('/attachments/:id', function (schema, request) {
      assert.equal(request.params.id, 20);
      done();

      schema.attachments.find(request.params.id).destroy();
    });

    await visit(`/view/${ticket.id}/attachments`);

    assert.equal(findAll('[data-test-attachment]').length, 3);
    assert.ok(find('[data-test-attachment="20"]'));
    assert.equal(findAll('[data-test-remove-attachment]').length, 1, 'can only remove own attachment');

    await click('[data-test-remove-attachment]');
    await click('[data-test-modal-confirm]');

    assert.equal(findAll('[data-test-attachment]').length, 2);
    assert.equal(findAll('[data-test-attachment="20"]').length, 0, 'attachment was removed');
  });


  test('(admin or author) if removing an attachment error, a message is displayed', async function(assert) {
    assert.expect(3);
    let currentUser = initSession();

    let ticket = server.create('ticket', {
      status: 'new',
      kind: 'company_ownership',
      requester: currentUser
    });

    server.create('attachment', {
      user: currentUser,
      ticket
    });

    server.del('/attachments/:id', {
      errors: [{ detail: "Unable to delete attachment." }]
    }, 500);

    await visit(`/view/${ticket.id}/attachments`);

    assert.equal(findAll('[data-test-attachment]').length, 1);

    await click('[data-test-remove-attachment]');
    await click('[data-test-modal-confirm]');

    assert.ok(find('.flash-message'), 'showing alert');

    await visit(`/view/${ticket.id}/attachments`);

    assert.equal(
      findAll('[data-test-attachment]').length, 1,
      'attachment was not removed'
    );
  });
});

