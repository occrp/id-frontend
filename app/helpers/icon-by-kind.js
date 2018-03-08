import { helper } from '@ember/component/helper';
import { icon } from 'id-frontend/helpers/icon';

export function iconByKind([assetId], namedArgs) {
  const mapKindToIcon = {
    person_ownership: 'person',
    company_ownership: 'briefcase',
    other: 'question'
  }

  return icon([mapKindToIcon[assetId]], namedArgs);
}

export default helper(iconByKind);
