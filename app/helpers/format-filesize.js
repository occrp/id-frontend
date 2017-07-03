import Ember from 'ember';
import filesize from 'filesize';

export function formatFilesize([value]) {
    let processed = filesize(value, { output: 'array' });
    processed[0] = processed[0].toFixed(2); // consistent number of decimals
    return processed.join(' ');
}

export default Ember.Helper.helper(formatFilesize);
