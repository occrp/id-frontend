import Serializer from './application';

export default Serializer.extend({
  include: ['user','comment']
});
