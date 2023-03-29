import { execSync } from "child_process"

export function shouldUseYarn(): boolean {
  try {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const userAgent = process.env.npm_config_user_agent
    if (userAgent && userAgent.startsWith("yarn")) {
      return true
    }
    execSync("yarnpkg --version", { stdio: "ignore" })
    return true
  } catch (e) {
    return false
  }
}
