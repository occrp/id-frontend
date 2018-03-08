module.exports = {
  globals: {
    server: true,
    initSession: true
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
  }
};
