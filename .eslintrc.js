module.exports = {
    "parser": "babel-eslint",
    "extends": "standard",
    "plugins": [
        "standard",
        "react"
    ],
    "rules": {
        "comma-dangle": [0],
        "space-before-function-paren": [0],
        "react/jsx-uses-react": [2],
        "react/jsx-uses-vars": [2],
        "react/react-in-jsx-scope": [2],
        "react/sort-comp": [0],
        "react/no-multi-comp": [0],
    },
    "env": {
        "browser": true,
    },
};
