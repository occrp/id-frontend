import Ember from 'ember';
import DS from 'ember-data';

let camelCaseKeys = function(hash) {
  let json = {};

  for (let prop in hash) {
    if (hash.hasOwnProperty(prop)) {
      json[Ember.String.camelize(prop)] = hash[prop];
    }
  }

  return json;
}

export default DS.JSONAPISerializer.extend({

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    let normalizedDocument = this._super(...arguments);

    // Customize document meta
    normalizedDocument.meta = camelCaseKeys(normalizedDocument.meta);

    return normalizedDocument;
  },

  extractRelationship(relationshipHash) {
    let normalizedRelationship = this._super(...arguments);

    // Customize relationship meta
    normalizedRelationship.meta = camelCaseKeys(normalizedRelationship.meta);

    return normalizedRelationship;
  }

});
