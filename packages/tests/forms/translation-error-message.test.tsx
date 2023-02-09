import React from "react"
import { vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { TranslationErrorMessage } from "./translation-error-message"

vi.mock("@hookform/error-message", () => {
  const ErrorMessage = ({ children }) => <div>{children}</div>
  return { ErrorMessage }
})

describe("<TranslationErrorMessage />", () => {
  it("renders the translation error message component", () => {
    const name = "test"
    const errors = {
      test: {
        message: "error",
        type: "oneOf",
        ref: {
          type: "checkbox",
          name: "test",
        },
      },
    }
    render(
      <TranslationErrorMessage errors={errors} name={name}>
        {errors && errors?.[name] && errors?.[name]?.message}
      </TranslationErrorMessage>,
    )
    const checkboxField = screen.getByText("error")
    //@ts-ignore
    expect(checkboxField).toBeInTheDocument()
  })
})
