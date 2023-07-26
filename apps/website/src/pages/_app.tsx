import type { AppProps } from "next/app";
import { UiProvider } from "@vastly/ui";
import theme from "@/theme";
import "../css/carousel.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UiProvider theme={theme}>
      <Component {...pageProps} />
    </UiProvider>
  );
}
