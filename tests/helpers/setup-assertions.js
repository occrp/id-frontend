import { assertionInjector, assertionCleanup } from 'id-frontend/tests/assertions';

export function setupAssertions(hooks) {
  hooks.beforeEach(function() {
    assertionInjector(this.owner);
  });
  hooks.afterEach(function() {
    assertionCleanup(this.owner);
  });
}