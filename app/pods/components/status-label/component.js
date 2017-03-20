import Ember from 'ember';
import { statusMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  statusMap,

  tagName: 'span',
  classNames: ['tag', 'tag--status'],
  classNameBindings: ['statusPOJO.labelClass'],

  statusPOJO: Ember.computed('status', function() {
    return statusMap[this.get('status')];
  })
}).reopenClass({
  positionalParams: ['status']
});
