import { createStylesContext } from "@chakra-ui/react";
import { createContext } from "@companydotcom/utils";
import type { PaginationItems } from "./use-pagination";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { SystemStyleObject } from "@chakra-ui/react";

/**
 * React context used to communicate between components
 */
export const [PaginationProvider, usePaginationContext] = createContext<PaginationItems[]>({
  name: "PaginationContext",
  errorMessage:
    "usePaginationContext: `context` is undefined. Seems you forgot to wrap all pagination components within <Pagination />",
});

export const [PaginationStylesProvider, usePaginationStyles] = createStylesContext("Pagination");
