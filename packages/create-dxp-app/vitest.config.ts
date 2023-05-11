import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    globals: true,
    environment: "jsdom",
    css: true,
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
