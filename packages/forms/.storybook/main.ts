import type { StorybookConfig } from "@storybook/react-webpack5";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@chakra-ui/storybook-addon",
  ],
  features: {
    storyStoreV7: true,
    buildStoriesJson: true,
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
export default config;
