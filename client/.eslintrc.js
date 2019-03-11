// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/essential"
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  ],
  // required to lint *.vue files
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    "generator-star-spacing": "off",
    quotes: "off",
    "space-before-function-paren": "off",
    semi: "off",
    camelcase: "off",
    "spaced-comment": "off",
    "handle-callback-err": "off",
    "no-trailing-spaces": "off",
    "no-multiple-empty-lines": "off",
    "standard/computed-property-even-spacing":"off",
    "no-irregular-whitespace":"off",
    eqeqeq:"off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};
