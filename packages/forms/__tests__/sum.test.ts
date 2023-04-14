import { sum } from "../test-components/sum";

describe("sum", () => {
  it("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  it("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).not.toBe(4);
  });

  it("adds -1 + 2 to equal 1", () => {
    expect(sum(-1, 2)).toBe(1);
  });
});
