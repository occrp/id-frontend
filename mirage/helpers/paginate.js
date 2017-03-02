import Ember from 'ember';

const { pluralize } = Ember.String;

export default function(collection, request, namespace) {
  var pageSize = parseInt(request.queryParams['page[size]'], 10);
  var pageNumber = parseInt(request.queryParams['page[number]'], 10);

  if (!pageNumber) {
    return;
  }

  var totalPages = Math.ceil(collection.models.length / pageSize);
  var model  = pluralize(collection.modelName);

  request.mirageLinks = {
    self: `${namespace}/${model}?page[number]=${pageNumber}&page[size]=${pageSize}`,
    first: `${namespace}/${model}?page[number]=1&page[size]=${pageSize}`,
    last: `${namespace}/${model}?page[number]=${totalPages}&page[size]=${pageSize}`,
    prev: null,
    next: null
  };

  if (pageNumber < totalPages) {
    request.mirageLinks.next = `${namespace}/${model}?page[number]=${pageNumber + 1}&page[size]=${pageSize}`;
  }

  if (pageNumber > 1) {
    request.mirageLinks.prev = `${namespace}/${model}?page[number]=${pageNumber - 1}&page[size]=${pageSize}`;
  }

  var start = 0 + (pageNumber-1) * pageSize;

  collection.models = collection.models.slice(start, start + pageSize);

  return collection;
}
