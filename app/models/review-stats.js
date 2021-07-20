import DS from 'ember-data';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

inflector.uncountable('review-stats');

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  count: attr('number'),
  ratings: attr('string'),

  ticket: belongsTo('ticket'),
  responder: belongsTo('profile')
});
