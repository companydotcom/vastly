import type { AppProps } from "next/app"
import { UiProvider } from "@dxp/ui"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UiProvider>
      <Component {...pageProps} />
    </UiProvider>
  )
}
