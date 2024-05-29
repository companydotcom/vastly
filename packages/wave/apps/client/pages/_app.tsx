import type { AppProps } from "next/app";
import { UiProvider } from "@vastly/ui";
import { ApolloWrapper } from '../apollo';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UiProvider>
      <ApolloWrapper>
        <Component {...pageProps} />
       </ApolloWrapper>
    </UiProvider>
  );
}
