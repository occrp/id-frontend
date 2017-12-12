import DS from 'ember-data';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

inflector.uncountable('ticket-stats');

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  date: attr('string'),
  count: attr('number'),
  status: attr('string'),
  avgTime: attr('number'),
  pastDeadlineCount: attr('number'),

  profile: belongsTo('profile')
});
