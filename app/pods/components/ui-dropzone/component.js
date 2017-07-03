import FileDropzone from 'ember-file-upload/components/file-dropzone/component';

export default FileDropzone.extend({
  classNameBindings: ['active:is-active', 'valid:is-valid:is-invalid'],
});
