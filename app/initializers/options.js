import config from '../config/environment';
import { set } from '@ember/object';

export function initialize(/* application */) {
  var metaTags = document.querySelectorAll(`meta[name^="${config.modulePrefix}"]`);

  // initialize .options key
  config.options = {};

  for (var i=0; i < metaTags.length; i++) {
    var key = metaTags[i].getAttribute('name');
    var value = metaTags[i].getAttribute('content');

    // Expected: <meta name="id-frontend/initializers/i18n/defaultLocale" content="en" />
    // Everything after /initializers is used as the path on the config object
    // Only config.options or keys already present on the config will work
    var path = key.split('/').slice(2);

    set(config, path.join('.'), value);
  }
}

export default {
  initialize
};
