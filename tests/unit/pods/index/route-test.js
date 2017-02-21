import { moduleFor, test } from 'ember-qunit';

moduleFor('route:index', 'Unit | Route | index');

test('should transition to browse route', function(assert) {
  let route = this.subject({
    replaceWith(routeName) {
      assert.equal(routeName, 'browse');
    }
  });
  route.beforeModel();
});
