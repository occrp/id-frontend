import Ember from 'ember';
import { kindList } from 'id-frontend/models/ticket';

export default Ember.Controller.extend({
  kindList,

  title: Ember.computed('model.kind', function () {
    switch (this.get('model.kind')) {
      case kindList[2]:
        return 'Request';
      default:
        return this.get('model.displayName');
    }
  })

});
