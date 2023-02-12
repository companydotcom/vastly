import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { CheckboxField } from "../test-components/checkbox-field"

describe("<CheckboxField />", () => {
  it("renders the checkbox field label", () => {
    const CheckboxComponent = () => {
      const methods = useForm()
      return (
        <FormProvider {...methods}>
          <CheckboxField name="checkboxA" register={methods.register} />
        </FormProvider>
      )
    }
    render(<CheckboxComponent />)
    const checkboxField = screen.getByRole("checkbox")
    expect(checkboxField).toBeInTheDocument()
  })

  it("checks the checkbox when clicked", () => {
    const CheckboxComponent = () => {
      const methods = useForm()
      return (
        <FormProvider {...methods}>
          <CheckboxField name="checkboxA" register={methods.register} />
        </FormProvider>
      )
    }
    render(<CheckboxComponent />)
    const checkboxField = screen.getByRole("checkbox")
    expect(checkboxField).not.toBeChecked()
    fireEvent.click(checkboxField)
    expect(checkboxField).toBeChecked()
  })

  it("renders helper text", () => {
    const CheckboxComponent = () => {
      const methods = useForm()
      return (
        <FormProvider {...methods}>
          <CheckboxField
            name="checkboxB"
            register={methods.register}
            helperText="we have helper text"
          />
        </FormProvider>
      )
    }
    render(<CheckboxComponent />)
    const checkboxField = screen.getByText("we have helper text")
    expect(checkboxField).toBeInTheDocument()
  })

  it("renders error", () => {
    const CheckboxComponent = () => {
      const methods = useForm()
      const errors = { checkboxC: { message: "we have an error" } }
      return (
        <FormProvider {...methods}>
          <CheckboxField name="checkboxC" register={methods.register} errors={errors} />
        </FormProvider>
      )
    }
    render(<CheckboxComponent />)
    const checkboxField = screen.getByText("we have an error")
    expect(checkboxField).toBeInTheDocument()
  })
})
