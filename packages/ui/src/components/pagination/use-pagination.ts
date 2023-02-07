import { useControllableState } from "@chakra-ui/react"

export type PageType =
  | "end-ellipsis"
  | "first"
  | "last"
  | "next"
  | "page"
  | "previous"
  | "start-ellipsis"
  | string

export type Items =
  | {
      onClick: (event: any) => void
      pageType: PageType
      page: number | null
      isSelected: boolean
      isDisabled: boolean
      "aria-current": React.AriaAttributes["aria-current"]
    }
  | {
      onClick: (event: React.ChangeEvent<unknown>) => void
      pageType: PageType
      page: number | null
      isSelected: boolean
      isDisabled: boolean
      "aria-current"?: React.AriaAttributes["aria-current"]
    }

export interface UsePaginationProps {
  count?: number
  boundaryCount?: number
  defaultPage?: number
  isDisabled?: boolean
  hideNextButton?: boolean
  hidePrevButton?: boolean
  onChange?: (event: any, value: number) => void
  page?: number
  siblingCount?: number
  items?: Items[]
}

export function usePagination(props: UsePaginationProps) {
  const {
    boundaryCount = 1,
    count = 1,
    defaultPage = 1,
    isDisabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page: pageProp,
    siblingCount = 1,
    ...other
  } = props

  const [page, setPageState] = useControllableState({
    value: pageProp,
    defaultValue: defaultPage,
  })

  const handleClick = (event: React.ChangeEvent<unknown>, value: number) => {
    if (!pageProp) {
      setPageState(value)
    }
    if (handleChange) {
      handleChange(event, value)
    }
  }

  // https://dev.to/namirsab/comment/2050
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  )

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  )

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  const itemList = [
    // ...(showFirstButton ? ['first'] : []),
    ...(hidePrevButton ? [] : ["previous"]),
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < count - boundaryCount - 1
      ? ["end-ellipsis"]
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),

    ...endPages,
    ...(hideNextButton ? [] : ["next"]),
    // ...(showLastButton ? ['last'] : []),
  ]

  // Map the button type to its page number
  const buttonPage = (pageType: PageType) => {
    switch (pageType) {
      case "first":
        return 1
      case "previous":
        return page - 1
      case "next":
        return page + 1
      case "last":
        return count
      default:
        return null
    }
  }

  // Convert the basic item list to PaginationItem props objects
  const items = itemList.map((item) => {
    return typeof item === "number"
      ? {
          onClick: (event: any) => {
            handleClick(event, item)
          },
          pageType: "page",
          page: item,
          isSelected: item === page,
          isDisabled,
          "aria-current": (item === page
            ? "true"
            : undefined) as React.AriaAttributes["aria-current"],
        }
      : {
          onClick: (event: React.ChangeEvent<unknown>) => {
            handleClick(event, buttonPage(item) as number)
          },
          pageType: item,
          page: buttonPage(item),
          isSelected: false,
          isDisabled:
            isDisabled ||
            (item.indexOf("ellipsis") === -1 &&
              (item === "next" || item === "last" ? page >= count : page <= 1)),
        }
  })

  return {
    items,
    ...other,
  }
}

export type UsePaginationReturn = ReturnType<typeof usePagination>
