module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["eslint-plugin-prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": "off",
    "func-names": "off",
    "no-console": "off",
  },
};
