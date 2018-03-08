/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let buildOptions = {
    storeConfigInMeta: false,

    fingerprint: {
      enabled: false
    },

    outputPaths: {
      app: {
        css: {
          'app': '/assets/id.css'
        },
        js: '/assets/id.js',
      }
    },

    'ember-composable-helpers': {
      only: ['pipe', 'pipe-action', 'toggle', 'contains']
    },

    nodeModulesToVendor: [
      'node_modules/filesize/lib',
      'node_modules/fuse.js/dist',
      'node_modules/moment-duration-format/lib'
    ],

    svgJar: {
      sourceDirs: [
        'node_modules/octicons/build/svg',
      ],
      strategy: 'symbol'
    }
  };

  if ( process.env.EMBER_ENV === 'development') {
    buildOptions.tests = false;
  }

  let app = new EmberApp(defaults, buildOptions);


  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/filesize.js', {
    using: [
      { transformation: 'amd', as: 'filesize' }
    ]
  });
  app.import('vendor/fuse.js');
  app.import('vendor/shims/fuse.js');
  app.import('vendor/moment-duration-format.js', {
    using: [
      { transformation: 'amd', as: 'moment-duration-format' }
    ]
  });

  return app.toTree();
};
