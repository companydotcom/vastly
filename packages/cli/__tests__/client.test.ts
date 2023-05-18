import { vi } from "vitest";
import { mockClient } from "./mocks/client";

describe("makeClient", async () => {
  it("should call request with expected arguments", async () => {
    const spy = vi.spyOn(mockClient, "fetch");

    const url = "http://localhost:3000/api/posts";
    const options = { method: "GET" };

    await mockClient.fetch(url, options);

    expect(spy).toHaveBeenCalledWith(url, options);
  });
});
