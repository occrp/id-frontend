'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let buildOptions = {
    babel: {
      plugins: ['@babel/plugin-proposal-object-rest-spread']
    },

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
      only: [
        'pipe',
        'pipe-action',
        'queue',
        'dec',
        'toggle',
        'contains',
        'array',
        'repeat',
        'range',
        'group-by',
        'map-by',
        'reduce',
        'filter-by'
      ]
    },

    svgJar: {
      sourceDirs: [
        'node_modules/@primer/octicons/build/svg',
      ],
      strategy: 'symbol'
    },

    autoImport: {
      alias: {
        'countries-en': 'i18n-iso-countries/langs/en.json',
        'fuse': 'fuse.js/dist/fuse.js',
        'moment-duration-format': 'moment-duration-format/lib/moment-duration-format.js',
        'filesize': 'filesize/lib/filesize.js'
      }
    }
  };

  if ( process.env.EMBER_ENV === 'development') {
    buildOptions.tests = false;
    buildOptions.babel.sourceMaps = 'inline';
    buildOptions.autoprefixer = {
      enabled: false
    }
  }

  let app = new EmberApp(defaults, buildOptions);

  return app.toTree();
};
