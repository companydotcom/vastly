import type { AppProps } from "next/app";
import { UiProvider } from "@vastly/ui";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UiProvider>
      <Component {...pageProps} />
    </UiProvider>
  );
}
