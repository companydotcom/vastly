import JoyCon from "joycon";
import { bundleRequire } from "bundle-require";
import { defineConfig } from "@vastly/utils";
import { Config } from "@vastly/types";
import path, { join } from "path";
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

// reads Vastly global "config" file atomically
export const readVastlyConfigFile = () => {
  const config = loadJsonFileSync(CONFIG_FILE_PATH);
  return config as Config;
};

export const readWaveConfigFile = async (
  cwd: string,
): Promise<{ path?: string; data?: ReturnType<typeof defineConfig> }> => {
  const configJoycon = new JoyCon();

  const configPath = configJoycon.resolveSync({
    files: ["wave.config.ts"],
    cwd,
    stopDir: path.parse(cwd).root,
    packageKey: "wave",
  });

  if (configPath) {
    const config = await bundleRequire({
      filepath: configPath,
    });

    return {
      path: configPath,
      data: config.mod.wave || config.mod.default || config.mod,
    };
  }

  return {};
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
