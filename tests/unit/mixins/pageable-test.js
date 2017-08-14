import Ember from 'ember';
import PageableMixin from 'id-frontend/mixins/pageable';
import { module, test } from 'qunit';

module('Unit | Mixin | pageable');

// Replace this with your real tests.
test('it works', function(assert) {
  let PageableObject = Ember.Object.extend(PageableMixin);
  let subject = PageableObject.create();
  assert.ok(subject);
});
