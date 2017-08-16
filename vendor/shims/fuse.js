(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['Fuse'],
      __esModule: true,
    };
  }

  define('fuse', [], vendorModule);
})();
