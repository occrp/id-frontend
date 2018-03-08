import { camelize } from '@ember/string';
import { typeOf } from '@ember/utils';
import DS from 'ember-data';

let camelCaseKeys = function(hash) {
  let json = {};

  for (let prop in hash) {
    if (hash.hasOwnProperty(prop)) {
      if (hash[prop] !== null && typeOf(hash[prop]) === 'object') {
        json[camelize(prop)] = camelCaseKeys(hash[prop]);
      } else {
        json[camelize(prop)] = hash[prop];
      }
    }
  }

  return json;
};

export default DS.JSONAPISerializer.extend({

  normalizeArrayResponse(store, primaryModelClass, payload/*, id, requestType*/) {
    let result = this._super(...arguments);

    // Customize document meta
    result.meta = camelCaseKeys(result.meta);

    if (payload.links) {
      result.meta.pagination = Object.assign({}, result.meta.pagination, this.createPageMeta(payload.links));
    }

    return result;
  },

  extractRelationship(/*relationshipHash*/) {
    let result = this._super(...arguments);

    // Customize relationship meta
    result.meta = camelCaseKeys(result.meta);

    return result;
  },

  createPageMeta(data) {
    let meta = {};

    Object.keys(data).forEach(type => {
      const link = data[type];
      meta[type] = {};

      if (!link) {
        return;
      }

      let a = document.createElement('a');
      a.href = link;

      a.search.slice(1).split('&').forEach(pairs => {
        const [param, value] = pairs.split('=');

        if (param === 'page[number]') {
          meta[type].number = parseInt(value);
        }
      });

      a = null;
    });

    return meta;
  }

});
