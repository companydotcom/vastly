import { createStylesContext } from "@chakra-ui/react"
import { createContext } from "@chakra-ui/react-context"
import { Items } from "./use-pagination"

/**
 * React context used to communicate between components
 */
export const [PaginationProvider, usePaginationContext] = createContext<Items[]>({
  name: "PaginationContext",
  errorMessage:
    "usePaginationContext: `context` is undefined. Seems you forgot to wrap all pagination components within <Pagination />",
})

export const [PaginationStylesProvider, usePaginationStyles] = createStylesContext("Pagination")
