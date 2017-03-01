import Ember from 'ember';
import { typeMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  typeMap,

  tagName: 'i',
  classNames: ['fa'],
  classNameBindings: ['typePOJO.icon'],
  // attributeBindings: ['typePOJO.name:title'],

  typePOJO: Ember.computed('type', function() {
    return typeMap[this.get('type')];
  })
}).reopenClass({
  positionalParams: ['type']
});
