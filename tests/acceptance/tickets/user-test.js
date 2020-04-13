import { click, fillIn, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupAssertions } from 'id-frontend/tests/helpers/setup-assertions';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { initSession } from 'id-frontend/tests/helpers/init-session';
import { faker } from 'ember-cli-mirage';

module('Acceptance | user', function(hooks) {
  setupApplicationTest(hooks);
  setupAssertions(hooks);
  setupMirage(hooks);

  test('requires bio before filling for ticket', async function(assert) {
    assert.expect(6);

    let currentUser = initSession({bio: ''});
    let done = assert.async();
    let newBio = faker.company.bs();

    server.patch('/profiles/' + currentUser.id, (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      assert.equal(attrs["data"]["attributes"]["bio"], newBio);
      assert.equal(attrs["data"]["id"], currentUser.id);
      assert.equal(attrs["data"]["type"], 'profiles');

      done();

      return currentUser.update(attrs.data.attributes);
    });

    await visit('/new');
    assert.equal(currentURL(), '/user?resumeSubmission=true');

    await fillIn('#user-bio', newBio);
    await click('[data-test-user-save]');
    assert.equal(currentURL(), '/new');

    await visit('/new');
    assert.equal(currentURL(), '/new');
  });
});
