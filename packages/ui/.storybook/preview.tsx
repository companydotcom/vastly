import React from "react"
import type { Decorator } from "@storybook/react"
import { UiProvider } from "../src/index"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const withUiProvider: Decorator = (Story) => <UiProvider>{Story()}</UiProvider>

export const decorators = [withUiProvider]
