import type { AppProps } from "next/app"
import { UiProvider } from "@companydotcom/ui"
import { SessionProvider } from "next-auth/react"

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <UiProvider>
        <Component {...pageProps} />
      </UiProvider>
    </SessionProvider>
  )
}
