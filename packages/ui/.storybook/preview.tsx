import React from "react";
import { UiProvider } from "../src/providers/ui-provider";
import { Preview } from "@storybook/react";
import { baseTheme } from '../src/theme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      exclude: /^_|as|html/,
      sort: 'requiredFirst'
    },
  },
  decorators: [
    (Story) => (
      <UiProvider theme={baseTheme}>
      <Story />
    </UiProvider>
    )
  ],
};

export default preview;
