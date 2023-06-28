import type { AppProps } from "next/app";
import { UiProvider } from "@vastly/ui";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UiProvider>
      <Component {...pageProps} />
    </UiProvider>
  );
}
