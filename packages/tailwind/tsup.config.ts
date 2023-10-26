import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  target: "es2019",
  format: ["cjs", "esm"],
  entry: ["src/**/*.{ts, tsx}"],
  // treeshake: true,
  // splitting: true,
  minify: true,
  clean: true,
  external: ["react"],
  banner: { js: '"use client";' },
});
