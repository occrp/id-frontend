import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { kindList } from 'id-frontend/models/ticket';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  i18n: service(),

  title: computed('model.kind', 'i18n.locale', function() {
    let i18n = this.get('i18n');

    switch (this.get('model.kind')) {
      case kindList[2]:
        return i18n.t('ticket.one');
      default:
        return this.get('model.displayName');
    }
  })
});
