import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('browse', { path: '/view' });
  this.route('new');
  this.route('user');
  this.route('view', { path: '/view/:ticket_id' }, function() {
    this.route('ticket', { path: '/' });
    this.route('attachments');

    this.route('expenses', function() {
      this.route('index', { path: '/' });
      this.route('new');
      this.route('expense', { path: '/:expense_id' });
    });
  });
  this.route('reporting', function() {
    this.route('staff');
    this.route('countries');
  });
});

export default Router;
