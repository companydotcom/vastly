import * as React from "react"
import { ChakraProvider, ChakraProviderProps } from "@chakra-ui/react"
import { baseTheme } from "../../theme"

export interface UiContextValue {
  linkComponent?: React.ElementType<any>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export const UiContext = React.createContext<UiContextValue>({})

interface UiProviderProps extends ChakraProviderProps {
  theme?: any
  linkComponent?: React.ElementType<any>
  children: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function UiProvider({ theme, linkComponent, onError, children, ...rest }: UiProviderProps) {
  const context = {
    linkComponent,
    onError,
  }

  return (
    <UiContext.Provider value={context}>
      <ChakraProvider {...rest} theme={theme || baseTheme}>
        {children}
      </ChakraProvider>
    </UiContext.Provider>
  )
}

export const useUi = (): UiContextValue => React.useContext(UiContext)
