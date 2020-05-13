import { Factory } from 'ember-cli-mirage';

import faker from 'faker';

export default Factory.extend({
  upload()        { return faker.image.image(); },
  fileName()      { return faker.system.commonFileName(); },
  fileSize()      { return faker.random.number(); },
  mimeType()      { return faker.system.mimeType(); },

  createdAt()     { return faker.date.past(); }
});
