import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  author: belongsTo('user'),
  assignee: belongsTo('user'),
  activities: hasMany(),
});
