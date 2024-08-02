const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
    "react/jsx-sort-props": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "import/order": "off",
    "react/function-component-definition": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "jsx-a11y/heading-has-content": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "jsx-a11y/anchor-has-content": "off",
    "func-names": "off",
    "no-implicit-coercion": "off",
    "@typescript-eslint/no-useless-template-literals": "off",
    "react/jsx-no-leaked-render": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/array-type": "off",
    "react/no-unknown-property": "off",
    "eslint-comments/require-description": "off",
  },
  overrides: [
    {
      files: ["*.config.js"],
      env: {
        node: true,
      },
    },
  ],
};
