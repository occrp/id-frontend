import Ember from 'ember';

export function sum(params) {
  return params.flat().reduce((a, b) => {
    return a + b;
  });
};

export default Ember.Helper.helper(sum);
