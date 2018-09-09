module.exports = {
  extends: ["airbnb"],
  parser: "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
  },
  "env": {
    "es6":     true,
    "browser": true,
  },
  rules: {
    "arrow-body-style": 0,
    "no-underscore-dangle": 0,
    semi: 0,
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/prop-types": 0,
    "arrow-parens": 0,
    "object-curly-newline": 0,
    "react/prefer-stateless-function": 0,
    "class-methods-use-this": 0,
    "global-require": 0,
    "react/no-array-index-key": 0,
    }
  }
