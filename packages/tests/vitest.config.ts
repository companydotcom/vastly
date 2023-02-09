import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    globals: true,
    environment: "jsdom",
    setupFiles: "./setup.js",
    coverage: {
      reporter: ["text", "json", "html"],
      reportsDirectory: "./vitest-coverage",
    },
  },
})
