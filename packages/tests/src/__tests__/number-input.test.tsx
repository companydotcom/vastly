import React from "react"
import { render, screen } from "@testing-library/react"
import { NumberInput } from "../forms/number-input"

describe("<NumberInput />", () => {
  it("renders the number input field", () => {
    render(<NumberInput />)
    const numberInputField = screen.getByRole("spinbutton")
    expect(numberInputField).toBeInTheDocument()
  })
  it("hides the stepper", () => {
    render(<NumberInput hideStepper={true} />)
    const numberInputField = screen.queryByRole("button")
    expect(numberInputField).not.toBeInTheDocument()
  })
})
