import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  tagName: '',

  isShowing: false,

  // These private methods are borrowed from Bootstrap 4's modal.js
  // They are used to fix content jumping in case of scrollbars on the body
  // Prompts use of jQuery

  _getScrollbarWidth() { // thx d.walsh
    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbarMeasure';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  },

  _checkScrollbar() {
    const rect = document.body.getBoundingClientRect()
    this._isBodyOverflowing = rect.left + rect.right < window.innerWidth
    this._scrollbarWidth = this._getScrollbarWidth()
  },

  _setScrollbar() {
    if (this._isBodyOverflowing) {
      // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
      // while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set

      // Adjust body padding
      const actualPadding = document.body.style.paddingRight
      const calculatedPadding = $('body').css('padding-right')
      $('body').data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
    }
  },

  _resetScrollbar() {
    // Restore body padding
    const padding = $('body').data('padding-right')
    if (typeof padding !== 'undefined') {
      $('body').css('padding-right', padding).removeData('padding-right')
    }
  },


  actions: {
    toggle() {
      if (this.get('isShowing') === false) {
        this._checkScrollbar();
        this._setScrollbar();
      } else {
        this._resetScrollbar();
      }

      this.toggleProperty('isShowing');

      // could use querySelector and .classList.toggle() with a polyfill
      // if jQuery is to be removed
      $('body').toggleClass('modal-open');
    },

    open() {
      if (this.get('isShowing') === true) {
        return;
      }

      this._checkScrollbar();
      this._setScrollbar();

      this.set('isShowing', true);

      $('body').addClass('modal-open');
    }
  }
});