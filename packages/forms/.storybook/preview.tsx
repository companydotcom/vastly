import React from 'react';
import type { Preview } from "@storybook/react";
import { Center, Container, UiProvider, baseTheme } from '@vastly/ui';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      exclude: /^_|as|html/,
    },
    options: {
      storySort: {
        order: ['Components', ['Form', 'Step Form']]
      }
    }
  },
  decorators: [
    (Story) => (
      <UiProvider>
        <Container h='auto'>
          <Story />
        </Container>
    </UiProvider>
    )
  ],
};

export default preview;
