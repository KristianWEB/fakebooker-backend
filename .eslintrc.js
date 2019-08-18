module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-console": "off",
    "no-underscore-dangle": 'off',
    "no-param-reassign": 0
  },
};
