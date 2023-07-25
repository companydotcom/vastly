import { Config } from "@vastly/types";
import { join } from "path";
import xdgAppPaths from "xdg-app-paths";
import type { XDGAppPaths } from "xdg-app-paths";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";

// Returns in which directory the config should be present
export const getGlobalPathConfig = (): string => {
  // NOTE: unclear why I had to explicitly type this as unknown first - after converting to ESM the types no longer worked, but only for this package
  const configDirs = (xdgAppPaths as unknown as XDGAppPaths)({
    name: "vastly",
  }).dataDirs();

  return configDirs[0];
};

export default getGlobalPathConfig;

const VASTLY_DIR = getGlobalPathConfig();
const CONFIG_FILE_PATH = join(VASTLY_DIR, "config.json");

export function getConfigFilePath() {
  return CONFIG_FILE_PATH;
}

// reads "config" file atomically
export const readConfigFile = () => {
  const config = loadJsonFileSync(CONFIG_FILE_PATH);
  return config as Config;
};

export const writeToConfigFile = (authConfig: Config, filePath?: string) => {
  try {
    return writeJsonFileSync(filePath || CONFIG_FILE_PATH, authConfig, {
      indent: 2,
      mode: 0o600,
    });
  } catch (err: unknown) {
    throw err;
  }
};
