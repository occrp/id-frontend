import { pluralize } from 'ember-inflector';

export default function(collection, request, namespace, opts = {}) {
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

  const start = (pageNumber-1) * pageSize;

  if (opts.reverse) {
    collection.models = collection.models.reverse().slice(start, start + pageSize).reverse();
  } else {
    collection.models = collection.models.slice(start, start + pageSize);
  }

  return collection;
}
