import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  createdAt: attr('date'),
  updatedAt: attr('date'),

  ticket: belongsTo(),
  user: belongsTo('profile')
});
