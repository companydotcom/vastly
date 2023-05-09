import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setup.ts"],
    css: true,
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
