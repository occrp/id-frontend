import Ember from 'ember';

export function icon([assetId], namedArgs) {
  let className = 'icon';
  if (namedArgs.class !== undefined) {
    className = `${className} ${namedArgs.class}`;
  }

  return Ember.String.htmlSafe(`<svg class="${className}"><use class="icon-${assetId}" xlink:href="#${assetId}" /></svg>`);
}

export default Ember.Helper.helper(icon);
