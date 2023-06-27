import type { StorybookConfig } from "@storybook/react-webpack5";
const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@chakra-ui/storybook-addon",
  ],
  features: {
    buildStoriesJson: true,
    storyStoreV7: true,
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
  refs: (config, { configType }) => {
    if (configType === "DEVELOPMENT") {
      return {
        "@vastly/forms": {
          title: "@vastly/forms development mode",
          url: "vastly-forms.vercel.app",
        },
        /**
         * TODO: remove disabled prop once bug fix/package version has been completed
         * https://github.com/chakra-ui/chakra-ui/pull/7678)
         * */
        "@chakra-ui/react": {
          disable: true,
        },
      };
    }
    return {
      "@vastly/forms": {
        title: "@vastly/forms",
        url: "vastly-forms.vercel.app",
      },
      /**
       * TODO: remove disabled prop once bug fix/package version has been completed
       * https://github.com/chakra-ui/chakra-ui/pull/7678)
       * */
      "@chakra-ui/react": {
        disable: true,
      },
    };
  },
};

export default config;
