import { helper } from '@ember/component/helper';

export function numeric(maybeNumeric) {
  return parseInt(maybeNumeric) || 0;
}

export default helper(numeric);
