import React, { MutableRefObject, ReactElement, RefAttributes, forwardRef } from "react"
import ReactSelect, { GroupBase, Props, SelectInstance } from "react-select"
import usePotionSelectProps from "./use-potion-select-props"

type SelectType = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: Props<Option, IsMulti, Group> & RefAttributes<SelectInstance<Option, IsMulti, Group>>,
) => ReactElement

// eslint-disable-next-line react/display-name
const Select = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: Props<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null,
  ) => {
    const potionSelectProps = usePotionSelectProps(props)

    return <ReactSelect ref={ref} {...potionSelectProps} />
  },
) as SelectType

export default Select
