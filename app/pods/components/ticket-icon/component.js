import Ember from 'ember';
import { typeMap } from 'id2-frontend/models/ticket';

export default Ember.Component.extend({
  typeMap,

  typePOJO: Ember.computed('type', function() {
    return typeMap[this.get('type')];
  })
});
