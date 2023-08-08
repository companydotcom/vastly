import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/react-webpack5";
const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@chakra-ui/storybook-addon"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
  ],
  features: {
    buildStoriesJson: true,
    storyStoreV7: true,
  },
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
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
          url: "http://localhost:9009/",
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
        url: "https://vastly-forms.vercel.app",
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
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
