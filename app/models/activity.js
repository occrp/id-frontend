import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  createdAt: attr('date'),
  verb: attr('string'),

  user: belongsTo('profile'),
  ticket: belongsTo(),

  comment: belongsTo(),
  attachment: belongsTo(),
  responderUser: belongsTo('profile')
});