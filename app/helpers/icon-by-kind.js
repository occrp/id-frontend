import { helper } from '@ember/component/helper';
import { icon } from 'id-frontend/helpers/icon';

export function iconByKind([assetId], namedArgs) {
  const mapKindToIcon = {
    person_ownership: 'person',
    company_ownership: 'briefcase',
    vehicle_tracking: 'rocket',
    data_request: 'database',
    other: 'question'
  }

  return icon([mapKindToIcon[assetId]], namedArgs);
}

export default helper(iconByKind);
