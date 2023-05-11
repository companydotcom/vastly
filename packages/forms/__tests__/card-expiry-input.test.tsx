import { render, screen } from "@testing-library/react";
import { CardExpiryInput } from "../src/components/card-expiry-input";

describe("CardExpiryInput", () => {
  test("renders the input with a card expiry format", () => {
    render(<CardExpiryInput />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "MM/YY");
  });
});
