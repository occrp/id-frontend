import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('browse', { path: '/view' });
  this.route('new');
  this.route('view', { path: '/view/:ticket_id' });
  this.route('reporting', function() {
    this.route('staff');
    this.route('countries');
  });
});

export default Router;
