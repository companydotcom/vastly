import { vi } from "vitest";
import { readConfigFile, writeToConfigFile } from "../src/util/config/files.js";
import { Config } from "../src/types/index.js";

let newConfig = { token: "" } as Config;

vi.mock("../src/util/config/files.js", () => {
  return {
    readConfigFile: () => ({ token: "abc123" }),
    writeToConfigFile: (config: Config) => {
      newConfig = config;
    },
  };
});

describe("config files", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("successfully reads global config file", async () => {
    const config = readConfigFile();

    expect(config).toEqual({ token: "abc123" });
  });

  test("should write the given config object to file", async () => {
    const expectedConfig: Config = { token: "myapisecret" };

    writeToConfigFile(expectedConfig);
    // Read the written file contents and verify if they match with the expected config
    const actualConfigJson = newConfig;

    expect(actualConfigJson).toEqual(expectedConfig);
  });
});
