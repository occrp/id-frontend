// Ember-I18n includes configuration for common locales. Most users
// can safely delete this file. Use it if you need to override behavior
// for a locale or define behavior for a locale that Ember-I18n
// doesn't know about.

// Extracted from https://github.com/jamesarosen/CLDR.js/blob/master/plurals.js#L102

function isAmong(value, array) {
  for ( var i = 0; i < array.length; ++i ) {
    if (array[i] === value) { return true; }
  }

  return false;
}

export default {
  // rtl: [true|FALSE],
  //
  // pluralForm: function(count) {
  //   if (count === 0) { return 'zero'; }
  //   if (count === 1) { return 'one'; }
  //   if (count === 2) { return 'two'; }
  //   if (count < 5) { return 'few'; }
  //   if (count >= 5) { return 'many'; }
  //   return 'other';
  // }

  pluralForm: function(n) {
    var mod10  = n % 10, mod100 = n % 100;

    if ( mod10 === 1 && n % 100 !== 11 ) { return 'one'; }

    if ( isAmong(mod10, [ 0, 5, 6, 7, 8, 9 ]) ||
         isAmong(mod100, [ 11, 12, 13, 14 ]) ) { return 'zero'; }

    // if ( isAmong(mod10, [ 2, 3, 4 ]) &&
    //      !isAmong(mod100, [ 12, 13, 14 ]) ) { return 'few'; }

    // Return `few` as `other`
    return 'other';
  }
};
