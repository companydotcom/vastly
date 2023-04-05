import { join } from "path"
import XDGAppPaths from "xdg-app-paths"
import { loadJsonFileSync } from "load-json-file"
import { writeJsonFileSync } from "write-json-file"

// Returns in which directory the config should be present
const getGlobalPathConfig = (): string => {
  const dxpDirectories = XDGAppPaths("com.dxp.cli").dataDirs()

  return dxpDirectories[0]
}

export default getGlobalPathConfig

// TODO: Rename to new brand
const DXP_DIR = getGlobalPathConfig()
const AUTH_CONFIG_FILE_PATH = join(DXP_DIR, "auth.json")

// reads "auth config" file atomically
export const readAuthConfigFile = () => {
  const config = loadJsonFileSync(AUTH_CONFIG_FILE_PATH)
  return config
}

interface AuthConfig {
  token?: string
}

export const writeToAuthConfigFile = (authConfig: AuthConfig) => {
  try {
    return writeJsonFileSync(AUTH_CONFIG_FILE_PATH, authConfig, {
      indent: 2,
      mode: 0o600,
    })
  } catch (err: unknown) {
    throw err
  }
}
