import React, { MutableRefObject, ReactElement, RefAttributes, forwardRef } from "react"
import { GroupBase, SelectInstance } from "react-select"
import AsyncCreatableReactSelect, { AsyncCreatableProps } from "react-select/async-creatable"
import usePotionSelectProps from "./use-potion-select-props"

type AsyncCreatableSelectType = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: AsyncCreatableProps<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>>,
) => ReactElement

// eslint-disable-next-line react/display-name
const AsyncCreatableSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: AsyncCreatableProps<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null,
  ) => {
    const potionSelectProps = usePotionSelectProps(props)

    return <AsyncCreatableReactSelect ref={ref} {...potionSelectProps} />
  },
) as AsyncCreatableSelectType

export default AsyncCreatableSelect
