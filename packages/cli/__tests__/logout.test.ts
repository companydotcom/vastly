import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe("logout", () => {
  it("should log a user out", async () => {});
  //   it("should empty out the local auth config", async () => {});
});
