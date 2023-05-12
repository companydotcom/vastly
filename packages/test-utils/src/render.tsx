import { UiProvider } from "@companydotcom/ui";
import "@testing-library/jest-dom/extend-expect";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import * as React from "react";
import { userEvent } from "./user-event";

export interface ChakraRenderOptions extends RenderOptions {
  withUiProvider?: boolean;
}

export function render(
  ui: React.ReactElement,
  { withUiProvider = true, ...options }: ChakraRenderOptions = {
    withUiProvider: true,
  },
): ReturnType<typeof rtlRender> & { user: ReturnType<typeof userEvent.setup> } {
  const { wrapper: Wrapper = React.Fragment, ...rtlOptions } = options;
  const user = userEvent.setup();

  const MaybeUiProvider = withUiProvider ? UiProvider : React.Fragment;

  const result = rtlRender(
    <MaybeUiProvider>
      <Wrapper>{ui}</Wrapper>
    </MaybeUiProvider>,
    rtlOptions,
  );
  return { user, ...result };
}
