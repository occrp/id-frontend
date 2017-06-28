import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  url: attr('string'),
  fileName: attr('string'),
  fileSize: attr('number'),
  mimeType: attr('string'),
  
  createdAt: attr('date'),
  updatedAt: attr('date'),

  user: belongsTo('profile'),
  ticket: belongsTo(),
});
