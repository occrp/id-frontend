import Component from '@ember/component';
import { computed } from '@ember/object';
import {
  kindList,
  dataRequestTypes,
  PersonValidations,
  CompanyValidations,
  VehicleValidations,
  DataValidations,
  OtherValidations
} from 'id-frontend/models/ticket';
import countries from 'i18n-iso-countries';
import moment from 'moment';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  kindList,
  dataRequestTypes,
  countries: countries.getNames('en'),
  session: service(),
  today: moment.utc(),
  minimumDeadline: moment.utc().add(3, 'days'),

  validations: computed('model.kind', function() {
    const kind = this.get('model.kind');

    if (kind === kindList[0]) {
      return PersonValidations;
    } else if (kind === kindList[1] ) {
      return CompanyValidations;
    } else if (kind === kindList[2] ) {
      return VehicleValidations;
    } else if (kind === kindList[3] ) {
      return DataValidations;
    } else {
      return OtherValidations;
    }
  }),

  saveRecord: task(function * (changeset) {
    yield changeset.save();
  }),

  actions: {
    save: function(changeset) {
      const model = this.get('model');
      const afterSave = this.get('afterSave');
      const saveRecord = this.get('saveRecord');

      changeset.validate().then(function() {
        if (changeset.get('isValid')) {
          saveRecord.perform(changeset).then(function() {
            afterSave(model);
          });
        }
      });
    }
  }
});
