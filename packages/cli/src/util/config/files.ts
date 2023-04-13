import { join } from "path"
import xdgAppPaths from "xdg-app-paths"
import { loadJsonFileSync } from "load-json-file"
import { writeJsonFileSync } from "write-json-file"

// Returns in which directory the config should be present
export const getGlobalPathConfig = (): string => {
  const vastlyDirectories = xdgAppPaths("com.vastly.cli").configDirs()

  return vastlyDirectories[0]
}

export default getGlobalPathConfig

const VASTLY_DIR = getGlobalPathConfig()
const AUTH_CONFIG_FILE_PATH = join(VASTLY_DIR, "auth.json")

// // reads "auth config" file atomically
// export const readAuthConfigFile = () => {
//   const config = loadJsonFileSync(AUTH_CONFIG_FILE_PATH)
//   return config
// }

// interface AuthConfig {
//   token?: string
// }

// export const writeToAuthConfigFile = (authConfig: AuthConfig) => {
//   try {
//     return writeJsonFileSync(AUTH_CONFIG_FILE_PATH, authConfig, {
//       indent: 2,
//       mode: 0o600,
//     })
//   } catch (err: unknown) {
//     throw err
//   }
// }
