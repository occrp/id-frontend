import Component from '@ember/component';
import { inject as service } from '@ember/service';
import groupByDate from 'id-frontend/pods/reporting/group-by-date';
import { task, all } from 'ember-concurrency';
import EmberObject from '@ember/object';

const Dataset = EmberObject.extend({
  id: null,
  taskInstance: null,
  total: 0,
  processedStats: null,
  user: null
});

export default Component.extend({
  tagName: '',
  store: service(),

  datasets: null,

  loadAll: task(function * () {
    let datasets = [];
    let childTasks = [];

    this.get('profiles').forEach((id) => {
      let dataset = Dataset.create({ id });
      let taskInstance = this.get('loadDataset').perform(dataset);

      dataset.set('taskInstance', taskInstance);
      datasets.push(dataset);
      childTasks.push(taskInstance);
    });

    this.set('datasets', datasets);
    yield all(childTasks);
  }).restartable(),

  loadDataset: task(function * (dataset) {
    const filter = Object.assign({
      'profile': dataset.get('id')
    }, this.get('filter'));

    const records = yield this.get('store').query('ticket-stats', {
      filter,
      include: 'profile'
    });

    dataset.set('total', records.get('meta.total'));
    dataset.set('processedStats', groupByDate(records));
    dataset.set('user', this.get('store').peekRecord('profile', dataset.get('id')));
  }),

  didReceiveAttrs() {
    this.get('loadAll').perform();
  }
});
