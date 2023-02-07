import React, { MutableRefObject, ReactElement, RefAttributes, forwardRef } from "react"
import { GroupBase, SelectInstance } from "react-select"
import AsyncReactSelect, { AsyncProps } from "react-select/async"
import usePotionSelectProps from "./use-potion-select-props"

type AsyncSelectType = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: AsyncProps<Option, IsMulti, Group> & RefAttributes<SelectInstance<Option, IsMulti, Group>>,
) => ReactElement

// eslint-disable-next-line react/display-name
const AsyncSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: AsyncProps<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null,
  ) => {
    const potionSelectProps = usePotionSelectProps(props)

    return <AsyncReactSelect ref={ref} {...potionSelectProps} />
  },
) as AsyncSelectType

export default AsyncSelect
