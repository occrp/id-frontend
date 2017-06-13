import Ember from 'ember';
import { kindMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  kindMap,

  tagName: 'i',
  classNames: ['fa'],
  classNameBindings: ['typePOJO.icon'],
  // attributeBindings: ['typePOJO.name:title'],

  typePOJO: Ember.computed('kind', function() {
    return kindMap[this.get('kind')];
  })
}).reopenClass({
  positionalParams: ['kind']
});
