import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { typeMap } from 'id2-frontend/models/ticket';

const assigneeNoneObj = { firstName: 'none' };

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

  hasFilters: Ember.computed.or('author', 'assignee', 'type'),

  currentAuthor: null,
  currentAssignee: null,

  loadCurrentFilters: function () {
    if (this.get('assignee') === 'none') {
      this.set('currentAssignee', assigneeNoneObj);
    }

    let filterMeta = this.get('filterMeta');
    if (!filterMeta) {
      return;
    }

    if (filterMeta.author) {
      this.set('currentAuthor', filterMeta.author);
    }
    if (filterMeta.assignee) {
      this.set('currentAssignee', filterMeta.assignee);
    }
  },

  didInsertElement() {
    this.loadCurrentFilters();
  },

  actions: {
    applyAuthor(user) {
      this.set('currentAuthor', user.attributes)
      this.get('updateFilter')('author', user.id)
    },

    applyAssignee(user) {
      if (user === 'none') {
        this.set('currentAssignee', assigneeNoneObj)
        this.get('updateFilter')('assignee', 'none');
      } else {
        this.set('currentAssignee', user.attributes)
        this.get('updateFilter')('assignee', user.id)
      }
    },

    reset() {
      this.get('resetFilters')();
      this.setProperties({
        currentAuthor: null,
        currentAssignee: null
      });
    }
  }

});
