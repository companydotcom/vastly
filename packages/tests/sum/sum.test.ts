import { sum } from "./sum"
import { it, expect } from "vitest"

it("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3)
})
