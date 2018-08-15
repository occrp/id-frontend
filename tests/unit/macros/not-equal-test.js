import notEqual from 'id-frontend/macros/not-equal';
import compute from 'ember-macro-test-helpers/compute';
import { module, test } from 'qunit';

module('Unit | Macro | not equal', function() {
  test('it works', function(assert) {
    compute({
      assert,
      computed: notEqual('key1', 'key2'),
      properties: {
        key1: 1,
        key2: 2
      },
      strictEqual: true
    });
  });
});
