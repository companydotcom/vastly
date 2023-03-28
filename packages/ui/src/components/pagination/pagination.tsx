import React, { useMemo } from "react"
import {
  IconButton,
  Button,
  ButtonProps,
  Icon,
  IconProps,
  SystemStyleObject,
  chakra,
  forwardRef,
  ThemingProps,
  useMultiStyleConfig,
  HTMLChakraProps,
  ComponentWithAs,
  BoxProps,
} from "@chakra-ui/react"
import { __DEV__ } from "@companydotcom/utils"
import { usePagination, PageType } from "./use-pagination"
import {
  PaginationProvider,
  PaginationStylesProvider,
  usePaginationStyles,
} from "./pagination-context"

export interface PaginationProps extends ThemingProps<"Pagination">, BoxProps {}

export const Pagination = forwardRef<PaginationProps, "nav">((props, ref) => {
  const { className, children, variant, size, colorScheme, ...rootProps } = props
  const styles = useMultiStyleConfig("Pagination", { variant, size, colorScheme })
  const { items } = usePagination(props)

  const context = useMemo(() => {
    return { ...items }
  }, [items])

  return (
    <PaginationProvider value={context}>
      <PaginationStylesProvider value={styles}>
        <chakra.nav
          aria-label="pagination navigation"
          ref={ref}
          className="potion-pagination"
          {...rootProps}
          __css={styles.root}
        >
          {children}
        </chakra.nav>
      </PaginationStylesProvider>
    </PaginationProvider>
  )
}) as ComponentWithAs<"nav", PaginationProps>

if (__DEV__) {
  Pagination.displayName = "Pagination"
}

export interface PaginationContainerProps extends HTMLChakraProps<"ul"> {}

export const PaginationContainer = forwardRef<PaginationContainerProps, "ul">((props, ref) => {
  const styles = usePaginationStyles()

  const containerStyles = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 0,
    margin: 0,
    listStyle: "none",
    "> :not(style) ~ :not(style)": {
      marginTop: "0px",
      marginInline: "6px 0px",
      marginBottom: "0px",
    },
    ...styles.container,
  }

  return (
    <chakra.ul
      ref={ref}
      {...props}
      className="potion-pagination__container"
      __css={containerStyles}
    />
  )
})

if (__DEV__) {
  PaginationContainer.displayName = "PaginationContainer"
}

export interface PaginationItemProps extends Omit<HTMLChakraProps<"button">, "aria-current"> {
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * The current page number.
   */
  page?: number | null
  /**
   * If `true` the pagination item is selected.
   * @default false
   */
  isSelected?: boolean

  /**
   * The type of pagination item.
   * @default 'page'
   */
  pageType?: PageType
  _current?: ButtonProps
}

export const PaginationItem = forwardRef<PaginationItemProps, "button">((props, ref) => {
  const {
    page,
    pageType = "page",
    isDisabled = false,
    isSelected = false,
    _current,
    ...rest
  } = props
  const styles = usePaginationStyles()
  const normalizedIcons = {
    previous: ChevronPrev,
    next: ChevronNext,
  }

  // @ts-ignore
  const Icon = normalizedIcons[pageType]
  const currentStyles = useMemo(
    // @ts-ignore
    () => (isSelected ? _current || styles.page?._current : {}),
    // @ts-ignore
    [isSelected, _current, styles.page?._current],
  )

  const pageStyles: SystemStyleObject = {
    ...styles.page,
    ...currentStyles,
  }

  return (
    <chakra.li>
      {pageType === "start-ellipsis" || pageType === "end-ellipsis" ? (
        <Button
          sx={pageStyles}
          className={`potion-pagination__${pageType}`}
          ref={ref}
          isDisabled={isDisabled}
        >
          …
        </Button>
      ) : Icon ? (
        <IconButton
          sx={pageStyles}
          aria-label={`${pageType} page`}
          className={`potion-pagination__${pageType}`}
          ref={ref}
          isDisabled={isDisabled}
          {...rest}
          icon={<Icon />}
        />
      ) : (
        <Button
          sx={pageStyles}
          className={`potion-pagination__${pageType}`}
          ref={ref}
          isDisabled={isDisabled}
          {...rest}
        >
          {pageType === "page" && page}
        </Button>
      )}
    </chakra.li>
  )
})

const ChevronPrev: React.FC<IconProps> = (props) => (
  <Icon viewBox="0 0 320 512" {...props}>
    <path
      fill="currentColor"
      d="M206.7 464.6l-183.1-191.1C18.22 267.1 16 261.1 16 256s2.219-11.97 6.688-16.59l183.1-191.1c9.152-9.594 24.34-9.906 33.9-.7187c9.625 9.125 9.938 24.37 .7187 33.91L73.24 256l168 175.4c9.219 9.5 8.906 24.78-.7187 33.91C231 474.5 215.8 474.2 206.7 464.6z"
    />
  </Icon>
)

const ChevronNext: React.FC<IconProps> = (props) => (
  <Icon viewBox="0 0 320 512" {...props}>
    <path
      fill="currentColor"
      d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"
    />
  </Icon>
)
