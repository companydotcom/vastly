import { shouldUseYarn } from "../src/utils/should-use-yarn.js";
import child_process, { execSync } from "child_process";

describe("shouldUseYarn", () => {
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
    const result = shouldUseYarn();
    expect(typeof result).toBe("boolean");
  });

  it("returns true when using yarn", () => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.npm_config_user_agent = "yarn";
    expect(shouldUseYarn()).toBe(true);
  });

  it("returns false when not using yarn and yarn is not installed", () => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    delete process.env.npm_config_user_agent;
    expect(shouldUseYarn()).toBe(false);
  });

  it("returns false when an error is thrown", () => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.npm_config_user_agent = "yarn";

    vi.mocked(execSync).mockImplementationOnce(() => {
      throw Error;
    });

    expect(shouldUseYarn()).toBe(false);
  });
});
