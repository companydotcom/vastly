import { shouldUsePnpm } from "../src/utils/should-use-pnpm.js";
import child_process, { execSync } from "child_process";

describe("shouldUsePnpm", () => {
  vi.mock("child_process", async (importOriginal: () => Promise<typeof child_process>) => {
    const mod = await importOriginal();

    return {
      ...mod,
      execSync: vi.fn(() => execSync),
    };
  });

  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns a boolean value", () => {
    const result = shouldUsePnpm();
    expect(typeof result).toBe("boolean");
  });

  it("returns true when using pnpm", () => {
    process.env["npm_config_user_agent"] = "pnpm";
    expect(shouldUsePnpm()).toBe(true);
  });

  it("returns false when not using pnpm and pnpm is not installed", () => {
    delete process.env["npm_config_user_agent"];
    vi.mocked(execSync).mockImplementationOnce(() => {
      throw Error;
    });
    expect(shouldUsePnpm()).toBe(false);
  });

  it("returns false when an error is thrown", () => {
    process.env["npm_config_user_agent"] = "yarn";

    vi.mocked(execSync).mockImplementationOnce(() => {
      throw Error;
    });

    expect(shouldUsePnpm()).toBe(false);
  });
});
