import React, { MutableRefObject, ReactElement, RefAttributes, forwardRef } from "react"
import { GroupBase, SelectInstance } from "react-select"
import CreatableReactSelect, { CreatableProps } from "react-select/creatable"
import usePotionSelectProps from "./use-potion-select-props"

type CreatableSelectType = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: CreatableProps<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>>,
) => ReactElement

// eslint-disable-next-line react/display-name
const CreatableSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: CreatableProps<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null,
  ) => {
    const potionSelectProps = usePotionSelectProps(props)

    return <CreatableReactSelect ref={ref} {...potionSelectProps} />
  },
) as CreatableSelectType

export default CreatableSelect
