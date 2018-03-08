import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

export function icon([assetId], namedArgs) {
  let className = 'icon';
  if (namedArgs.class !== undefined) {
    className = `${className} ${namedArgs.class}`;
  }

  return htmlSafe(`<svg class="${className}"><use class="icon-${assetId}" xlink:href="#${assetId}" /></svg>`);
}

export default helper(icon);
