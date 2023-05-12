import { configDefaults, defineProject } from "vitest/config";

export default defineProject({
  test: {
    exclude: [...configDefaults.exclude],
    globals: true,
    environment: "jsdom",
    css: true,
  },
});
