import { defineConfig } from "@vastly/utils";

const WAVE_CONFIG = defineConfig({
  name: "<%= appName %>",
  stage: "",
  accountId: "",
  hostedZone: "vastly.tech",
});

export default WAVE_CONFIG;
