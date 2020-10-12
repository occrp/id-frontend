import { helper } from '@ember/component/helper';

export function jsonPrettyPrint(json) {
  return JSON.stringify(json, null, '  ');
}

export default helper(jsonPrettyPrint);
