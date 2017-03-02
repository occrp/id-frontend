import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(object, request) {
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);

    if (request.mirageMeta) {
      json.meta = request.mirageMeta;
    }

    if (request.mirageLinks) {
      json.links = request.mirageLinks;
    }

    return json;
  }
});
