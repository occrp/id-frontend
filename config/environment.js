/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'id-frontend',
    podModulePrefix: 'id-frontend/pods',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      rootElement: '#ember-app',
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    moment: {
      outputFormat: 'MMM DD YYYY',
      includeLocales: ['bs', 'ru', 'fr', 'es', 'ar']
    },

    i18n: {
      defaultLocale: 'en',

      // These next 2 props are used in the app, not coming from the addon
      activeLocales: [
        'en',
        'ru',
        'bs',
        // 'fr',
        'es',
        // 'ar'
      ],

      // Keeping this array updated manually for now
      // Ideally: https://github.com/jamesarosen/ember-i18n/issues/375
      // Used by the extended i18n service
      rtlLocales: [
        'ar'
      ],
    },

    flashMessageDefaults: {
      sticky: true,
      preventDuplicates: true
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.exportApplicationGlobal = true;
    ENV.rootURL = '/tickets/';
    ENV['ember-cli-mirage'] = {
      enabled: false
    };
  }

  return ENV;
};
