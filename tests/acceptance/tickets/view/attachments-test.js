import { test } from 'qunit';
import moduleForAcceptance from 'id-frontend/tests/helpers/module-for-acceptance';

import File from 'ember-file-upload/file';
import upload from 'id-frontend/tests/helpers/upload'; // from the addon
import { upload as mirageUpload } from 'ember-file-upload/mirage';

moduleForAcceptance('Acceptance | tickets/view - attachments');

test('uploading a file', async function(assert) {
  assert.expect(6);
  let currentUser = initSession();

  let ticket = server.create('ticket', {
    id: 33,
    status: 'new',
    kind: 'company_ownership',
  });

  let done = assert.async();
  server.post('/attachments', mirageUpload(function (schema, request) {
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

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-attachment]').length, 0, 'no attachments initially');
  assert.equal(find('[data-test-activity]').length, 0);

  let file = File.fromDataURL('data:image/gif;base64,R0lGODdhCgAKAIAAAAEBAf///ywAAAAACgAKAAACEoyPBhp7vlySqVVFL8oWg89VBQA7');

  // ಠ_ಠ https://github.com/tim-evans/ember-file-upload/pull/25#issuecomment-284299637
  await upload('[data-test-file-upload] input', file.blob, 'smile.gif');

  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-attachment]').length, 1, 'file was uploaded');
  assert.equal(find('[data-test-attachment]').attr('title'), 'smile.gif');
  assert.equal(find('[data-test-activity=attachment]').length, 1, 'new activity is rendered');
});


test('(admin or author) removing an attachment', async function(assert) {
  assert.expect(5);
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

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-attachment]').length, 3);
  findWithAssert('[data-test-attachment=20]');
  assert.equal(find('[data-test-remove-attachment]').length, 1, 'can only remove own attachment');

  await click('[data-test-remove-attachment]');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-attachment]').length, 2);
  assert.equal(find('[data-test-attachment=20]').length, 0, 'attachment was removed');
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

  await visit(`/view/${ticket.id}`);

  assert.equal(find('[data-test-attachment]').length, 1);

  await click('[data-test-remove-attachment]');
  await click('[data-test-modal-confirm]');

  assert.equal(find('[data-test-attachment]').length, 1, 'attachment was not removed');
  assert.ok(find('.flash-message').length > 0, 'showing alert');
});

