module.exports = {
  "parser": "babel-eslint",
  "extends": "standard",
  "plugins": [
    "jsx-a11y",
    "react"
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
  },
  "env": {
    // "brower": true,
    "node": true
  },
  "rules": {
    "indent": ["error", 2],
    "simi": [0]
  },
  "globals": {
    "window": true,
    "document": true
  }
}