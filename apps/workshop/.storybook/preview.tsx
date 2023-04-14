import React from "react";
import { UiProvider } from "@companydotcom/ui";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const withUi = (Story) => {
  return (
    <UiProvider>
      <Story />
    </UiProvider>
  );
};

export const decorators = [withUi];
