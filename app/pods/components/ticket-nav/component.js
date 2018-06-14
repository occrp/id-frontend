import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  searchTickets: task(function * (term) {
    yield timeout(250);

    this.get('updateFilter')('search', term);
  }).restartable(),
});
