/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'id2-frontend',
    podModulePrefix: 'id2-frontend/pods',
    environment: environment,
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
      outputFormat: 'MMM DD YYYY'
    },

    i18n: {
      defaultLocale: 'en'
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
