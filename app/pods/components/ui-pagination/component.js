import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['pg'],

  route: '',

  // Generate the page numbers and separators to be used in the template.
  //
  // Ex: total = 25; current = 9; padding = 2;
  // => [1, 2, false, 7, 8, 9, 10, 11, false, 24, 25]

  total: Ember.computed.or('meta.pagination.last.number', 'current'),

  items: Ember.computed('meta.pagination', function() {
    const total = this.get('total');
    const current = this.get('current');

    if (!total) {
      return [];
    }

    let collection = [];
    let padding = 2;

    for (var n = 1; n <= total; n++) {
      if (
        (n > padding && n < current - padding && padding + 1 !== current - padding - 1)
        || (n > current + padding && n <= total - padding && current + padding + 1 !== total - padding)
      ) {
        if (collection[collection.length - 1] !== false) {
          collection.push(false);
        }
      } else {
        collection.push(n);
      }
    }

    return collection;
  }),

});
