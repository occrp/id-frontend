import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { typeMap } from 'id2-frontend/models/ticket';

let blankSearchResults = {
  author: null,
  staff: null
};

const searchGenerator = function * (isStaff, term) {
  let cacheKey = isStaff ? 'staff' : 'author';

  if (Ember.isBlank(term) && blankSearchResults[cacheKey] !== null) {
    return blankSearchResults[cacheKey];
  }

  yield timeout(250);

  let modelName = 'user';
  let adapter = Ember.getOwner(this).lookup('adapter:application');
  let serializer = this.get('store').serializerFor(modelName);

  let payload = yield adapter.ajax(
    adapter.buildURL(modelName, null, null, 'query'),
    'GET',
    { data: { filter: { search: term, 'is-staff': isStaff } } }
  );

  let items = serializer.normalizeArrayResponse(
    this.get('store'),
    modelName,
    payload,
    null,
    'query'
  );

  if (Ember.isBlank(term)) {
    blankSearchResults[cacheKey] = items.data;
  }

  return items.data;
};

export default Ember.Component.extend({
  store: Ember.inject.service(),
  typeMap,

  sortFields: {
    '-created': 'Newest',
    'created': 'Oldest',
    'deadline': 'Closest deadline',
    '-deadline': 'Furthest deadline'
  },

  searchAuthor: task(searchGenerator).restartable(),
  searchStaff: task(searchGenerator).restartable(),

  actions: {
    applyAuthor(user) {
      this.get('updateFilter')('author', user.id, user.attributes);
    },

    applyAssignee(user) {
      if (user === 'none') {
        this.get('updateFilter')('assignee', 'none');
      } else {
        this.get('updateFilter')('assignee', user.id, user.attributes);
      }
    }
  }

});
