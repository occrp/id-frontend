import { helper } from '@ember/component/helper';
import { htmlSafe as _htmlSafe } from '@ember/template';
import { isHTMLSafe } from '@ember/template';

/*
  Stolen from:
    https://github.com/romulomachado/ember-cli-string-helpers
*/
export function createStringHelperFunction(stringFunction) {
  return function([string]) {
    if (isHTMLSafe(string)) {
      string = string.string;
    }

    string = string || '';
    return stringFunction(string);
  };
}

export const htmlSafe = createStringHelperFunction(_htmlSafe);
export default helper(htmlSafe);
