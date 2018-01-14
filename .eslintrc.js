module.exports = {
  extends: ["airbnb"],
  "parserOptions": {
    "ecmaVersion": 6,
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
    semi: 0,
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/prop-types": 0,
    "arrow-parens": 0,
    "object-curly-newline": 0,
    }
  }
