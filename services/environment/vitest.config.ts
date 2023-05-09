import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: true,
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
