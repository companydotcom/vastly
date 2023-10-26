const { vastlyui } = require("@vastly/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["app/**/*.{ts,tsx}", "./node_modules/@vastly/tailwind/dist/*.{js,ts,jsx,tsx}"],
  plugins: [vastlyui()],
};
