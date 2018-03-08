import { computed } from '@ember/object';
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';

export default ModalDialog.extend({
  modifiers: '',

  targetAttachment: 'none',
  translucentOverlay: true,
  wrapperClassNames: 'modal',
  containerClassNames: computed('modifiers', function() {
    return `modal-dialog ${this.get('modifiers')}`;
  }),
  overlayClassNames: 'modal-backdrop',
  overlayPosition: 'sibling'
});
