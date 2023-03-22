module.exports = {
  extends: [
    "eslint:recommended",
    "turbo",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: ["./package.json", "./package-lock.json"],
  overrides: [
    {
      files: ["**/__tests__/**/*"],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
  },
}
