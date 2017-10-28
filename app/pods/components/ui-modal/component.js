import Ember from 'ember';
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';

export default ModalDialog.extend({
  modifiers: '',

  targetAttachment: 'none',
  translucentOverlay: true,
  wrapperClassNames: 'modal',
  containerClassNames: Ember.computed('modifiers', function() {
    return `modal-dialog ${this.get('modifiers')}`;
  }),
  overlayClassNames: 'modal-backdrop',
  overlayPosition: 'sibling'
});
