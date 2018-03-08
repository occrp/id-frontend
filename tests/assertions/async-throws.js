import Ember from 'ember';

let originalLoggerError;
let originalTestAdapterException;
let originalEmberOnError;
let originalWindowOnError;

function intercept(f = () => {}) {
  originalLoggerError = Ember.Logger.error;
  originalTestAdapterException = Ember.Test.adapter.exception;
  originalWindowOnError = window.onerror;
  originalEmberOnError = Ember.onerror;
  Ember.Logger.error = () => {};
  Ember.Test.adapter.exception = () => {};
  Ember.onerror = f;
  window.onerror = () => {};
}

function restore() {
  Ember.Logger.error = originalLoggerError;
  Ember.Test.adapter.exception = originalTestAdapterException;
  Ember.onerror = originalEmberOnError;
  window.onerror = originalWindowOnError;
}

export default function asyncThrows(context, f, text) {
  let done = this.async();
  let loggedErrorArgs;

  intercept((...args) => {
    loggedErrorArgs = args;
  });

  return f()
    .then(() => {
      let errorText = (loggedErrorArgs || []).join(' ');

      if (text) {
        let result = errorText.match(text);

        this.pushResult({
          result,
          expected: text,
          actual: errorText,
          message: `Expected to see error '${text}'`
        });
      } else {
        this.pushResult({
          result: false,
          expected: '',
          actual: errorText,
          message: `You're using asyncThrows but you didn't add text to the assertion. Add some text as the second argument so the actual exception being thrown is what you expect it is.`
        });
      }

      return done();
    })
    .then(() => {
      return restore();
    });
}