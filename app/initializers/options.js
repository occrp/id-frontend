import config from '../config/environment';

export function initialize(/* application */) {
  var options = {};
  var metaTags = document.querySelectorAll(`meta[name^="${config.modulePrefix}"]`);

  for(var i=0; i < metaTags.length; i++) {
    var key = metaTags[i].getAttribute('name');
    var value = metaTags[i].getAttribute('content');
    var name = key.split('/').pop();

    options[name] = value;
  }

  config.options = options;
}

export default {
  initialize
};
