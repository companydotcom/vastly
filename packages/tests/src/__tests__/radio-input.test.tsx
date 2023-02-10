import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { RadioInput } from "../forms/radio-input"

describe("<RadioInput />", () => {
  it("renders the correct amount of radio options", () => {
    const options = [
      { value: "a", label: "a" },
      { value: "b", label: "b" },
      { value: "c", label: "c" },
    ]
    render(<RadioInput options={options} />)
    const radioInputField = screen.getAllByRole("radio")
    expect(radioInputField.length).toBe(options.length)
  })
  it("checks the option when clicked", () => {
    const options = [
      { value: "a", label: "a" },
      { value: "b", label: "b" },
      { value: "c", label: "c" },
    ]
    render(<RadioInput options={options} />)
    const radioA = screen.getByLabelText("a")
    expect(screen.getByLabelText("a")).not.toBeChecked()
    expect(screen.getByLabelText("b")).not.toBeChecked()
    expect(screen.getByLabelText("c")).not.toBeChecked()
    fireEvent.click(radioA)
    expect(screen.getByLabelText("a")).toBeChecked()
    expect(screen.getByLabelText("b")).not.toBeChecked()
    expect(screen.getByLabelText("c")).not.toBeChecked()
  })
})
