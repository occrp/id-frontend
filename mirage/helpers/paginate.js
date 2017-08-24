import Ember from 'ember';

const { pluralize } = Ember.String;

export default function(collection, request, namespace) {
  const pageSize = parseInt(request.queryParams['page[size]'], 10);
  const pageNumber = parseInt(request.queryParams['page[number]'], 10);

  if (!pageNumber) {
    return collection;
  }

  const totalPages = Math.ceil(collection.models.length / pageSize);
  const model  = pluralize(collection.modelName);

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

  // Add "classic" meta. Not used tho
  request.mirageMeta = request.mirageMeta || {};
  request.mirageMeta.pagination = {
    page: pageNumber,
    pages: totalPages,
    count: collection.models.length
  };

  const start = 0 + (pageNumber-1) * pageSize;

  collection.models = collection.models.slice(start, start + pageSize);

  return collection;
}
