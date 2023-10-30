import { defineConfig } from "tsup";

// Need to figure out how to build and package everything correctly
// https://github.com/egoist/tsup/issues/835
// https://stackoverflow.com/questions/72149666/a-fool-proof-tsup-config-for-a-react-component-library

export default defineConfig({
  dts: true,
  target: "es2019",
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  // treeshake: true,
  // splitting: true,
  minify: true,
  clean: true,
  external: ["react"],
  banner: { js: '"use client";' },
});
