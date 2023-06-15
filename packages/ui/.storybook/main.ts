import type { StorybookConfig } from "@storybook/react-webpack5";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@chakra-ui/storybook-addon",
  ],
  features: {
    buildStoriesJson: true,
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  typescript: {
    check: true,
  },
  refs: {
    /**
     * TODO: replace localhost with deployed `forms` url
     * */
    "@vastly/forms": {
      title: "@vastly/forms",
      url: "http://localhost:9009",
    },
    /**
     * TODO: remove disabled prop once bug fix/package version has been completed
     * https://github.com/chakra-ui/chakra-ui/pull/7678)
     * */
    "@chakra-ui/react": {
      disable: true,
    },
  },
};

export default config;
