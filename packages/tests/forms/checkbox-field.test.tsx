import React from "react"
import { render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { CheckboxField } from "./checkbox-field"

describe("<CheckboxField />", () => {
  it("renders the checkbox field label", () => {
    const TestInput = () => {
      const methods = useForm()
      return (
        <FormProvider {...methods}>
          <CheckboxField name="hello" register={methods.register} />
        </FormProvider>
      )
    }
    render(<TestInput />)
    const checkboxField = screen.getByRole("checkbox")
    expect(checkboxField).toBeInTheDocument()
  })

  it("renders helper text", () => {
    const TestInput = () => {
      const methods = useForm()
      return (
        <FormProvider {...methods}>
          <CheckboxField name="hello" register={methods.register} helperText="helper text" />
        </FormProvider>
      )
    }
    render(<TestInput />)
    const checkboxField = screen.getByText("helper text")
    expect(checkboxField).toBeInTheDocument()
  })

  it("renders error when there is an error", () => {
    const TestInput = () => {
      const methods = useForm()
      const errors = { name: { message: "error" } }
      return (
        <FormProvider {...methods}>
          <CheckboxField name="hello" register={methods.register} errors={errors} />
        </FormProvider>
      )
    }
    render(<TestInput />)
    const checkboxField = screen.getByRole("checkbox")
    expect(checkboxField).toBeInTheDocument()
  })
})
