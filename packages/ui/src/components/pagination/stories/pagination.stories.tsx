import * as React from "react"
import { chakra } from "@chakra-ui/react"
import { Pagination, PaginationContainer, PaginationItem } from "../pagination"
import { usePagination } from "../use-pagination"

export default {
  title: "Potion/Disclosure/Pagination",
  decorators: [(story: Function) => <chakra.div>{story()}</chakra.div>],
}

export const Basic = () => {
  const { items } = usePagination({ count: 8 })

  return (
    <Pagination>
      <PaginationContainer>
        {items.map((item) => (
          <PaginationItem {...item} />
        ))}
      </PaginationContainer>
    </Pagination>
  )
}

export const WithSizes = () => {
  const { items } = usePagination({ count: 8 })
  const sizes = ["xs", "sm", "md", "lg"]
  return sizes.map((size) => (
    <Pagination variant="ghost" size={size} key={size} mb={4}>
      <PaginationContainer>
        {items.map((item) => (
          <PaginationItem {...item} />
        ))}
      </PaginationContainer>
    </Pagination>
  ))
}

export const WithVariants = () => {
  const { items } = usePagination({ count: 8 })
  const variants = ["ghost", "outline", "unstyled"]
  return variants.map((variant) => (
    <>
      <p>{variant}</p>
      <Pagination variant={variant} key={variant} mb={4}>
        <PaginationContainer>
          {items.map((item) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    </>
  ))
}

export const WithColorSchemes = () => {
  const { items } = usePagination({ count: 8 })
  const colorSchemes = ["green", "red", "blue"]
  return colorSchemes.map((colorScheme) => (
    <>
      <p>{colorScheme}</p>
      <Pagination colorScheme={colorScheme} key={colorScheme} mb={4}>
        <PaginationContainer>
          {items.map((item) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    </>
  ))
}
