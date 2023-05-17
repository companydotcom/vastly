import { vi } from "vitest";
import { mockClient } from "./mocks/client";
import logout from "../src/commands/logout";
import { defaultConfig } from "../src/util/config/defaults";

describe("logout", () => {
  it("should return 0 and print message if token is missing", async () => {
    const clientWithoutToken = {
      ...mockClient,
      config: {},
    };

    // @ts-ignore
    const returnValue = await logout(clientWithoutToken);

    expect(returnValue).toBe(0);
  });

  it("should delete the token from config and write it to file", async () => {
    const clientWithToken = {
      ...mockClient,
      config: { ...defaultConfig, token: "abc123" },
    };

    const spy = vi.spyOn(clientWithToken.output, "debug");
    expect(clientWithToken.config.token).toBe("abc123");

    // @ts-ignore
    await logout(clientWithToken);

    expect(clientWithToken.config.token).toBe(undefined);
    expect(clientWithToken.config).toEqual(defaultConfig);
    expect(spy).toHaveBeenCalledWith("Config file deleted");
  });
});
