import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { typeMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  typeMap,

  sortFields: {
    '-created': 'Newest',
    'created': 'Oldest',
    'deadline': 'Closest deadline',
    '-deadline': 'Furthest deadline'
  },

  blankSearchResults: null,

  searchUser: task(function * (term) {
    if (Ember.isBlank(term) && this.get('blankSearchResults') !== null) {
      return this.get('blankSearchResults');
    }

    yield timeout(250);

    let modelName = 'user';
    let adapter = Ember.getOwner(this).lookup('adapter:application');
    let serializer = this.get('store').serializerFor(modelName);

    let payload = yield adapter.ajax(
      adapter.buildURL(modelName, null, null, 'query'),
      'GET',
      {
        data: {
          filter: { search: term },
          page: { number: 1, size: 6 }
        }
      }
    );

    let items = serializer.normalizeArrayResponse(
      this.get('store'),
      modelName,
      payload,
      null,
      'query'
    );

    if (Ember.isBlank(term)) {
      this.set('blankSearchResults', items.data);
    }

    return items.data;
  }).restartable(),

  actions: {
    applyAuthor(user) {
      this.get('updateFilter')('author', user.id, user.attributes)
    },

    applyAssignee(user) {
      if (user === 'none') {
        this.get('updateFilter')('assignee', 'none');
      } else {
        this.get('updateFilter')('assignee', user.id, user.attributes)
      }
    }
  }

});
