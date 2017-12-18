import { Factory } from 'ember-cli-mirage';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default Factory.extend({
  count()             { return randomInt(0, 42); },
  avgTime()           { return randomInt(16, 360); },
  pastDeadlineCount() { return 10; }
});
