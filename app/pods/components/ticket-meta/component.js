import Ember from 'ember';
import { task } from 'ember-concurrency';
import { getSearchGenerator } from 'id-frontend/models/profile';

const relRemovalGenerator = function * (rel) {
  try {
    yield rel.destroyRecord();
  } catch (e) {
    this.get('flashMessages').danger('errors.genericRequest');
  }
};

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  activityBus: Ember.inject.service(),

  searchStaff: task(getSearchGenerator({ isStaff: true })).restartable(),

  addResponder: task(function * (ticket, user) {
    let record = this.get('store').createRecord('responder', {
      ticket,
      user
    });
    try {
      yield record.save();
    } catch (e) {
      record.rollbackAttributes();
      this.get('flashMessages').danger('errors.genericRequest');
    }
  }),

  removeResponder: task(relRemovalGenerator),
  removeSubscriber: task(relRemovalGenerator),

  // duplicate tasks for handiling currentUser (mainly to separate UI spinners)
  unassignSelf: task(relRemovalGenerator),
  unsubscribeSelf: task(relRemovalGenerator),

  // using just 'model.subscribers.[]' won't work because it triggers
  // the recalculation before a POST /subscribers/ responds succesfully
  subscriberForCurrentUser: Ember.computed('model.subscribers.@each.id', function() {
    const userId = this.get('session.currentUser.id');
    let subscriber = null;

    this.get('model.subscribers').forEach(item => {
      if (item.belongsTo('user').id() === userId) {
        subscriber = item;
      }
    });

    return subscriber;
  }),

  responderForCurrentUser: Ember.computed('model.responders.@each.id', function() {
    const userId = this.get('session.currentUser.id');
    let responder = null;

    this.get('model.responders').forEach(item => {
      if (item.belongsTo('user').id() === userId) {
        responder = item;
      }
    });

    return responder;
  }),

  actions: {
    addResponder(user) {
      const ticket = this.get('model');
      this.get('addResponder').perform(ticket, user).then(() => {
        // Reloading the model too since the status will change
        // when adding the first responder
        ticket.reload();
        this.get('activityBus').trigger('reload');
      });
    },

    removeResponder(responder) {
      this.get('removeResponder').perform(responder).then(() => {
        this.get('activityBus').trigger('reload');
      });
    },

    // task handled inside the dedicated component
    afterAddSubscriber() {
      this.get('activityBus').trigger('reload');
    },

    removeSubscriber(subscriber) {
      this.get('removeSubscriber').perform(subscriber).then(() => {
        this.get('activityBus').trigger('reload');
      });
    },

    unassignSelf() {
      this.get('unassignSelf').perform(this.get('responderForCurrentUser')).then(() => {
        this.get('activityBus').trigger('reload');
      });
    },
    unsubscribeSelf() {
      this.get('unsubscribeSelf').perform(this.get('subscriberForCurrentUser')).then(() => {
        this.get('activityBus').trigger('reload');
      });
    }

  }

});
