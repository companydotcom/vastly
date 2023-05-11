import { execSync } from "child_process";

export function shouldUsePnpm(): boolean {
  try {
    const userAgent = process.env["npm_config_user_agent"];
    if (userAgent && userAgent.startsWith("pnpm")) {
      execSync("pnpm --version", { stdio: "ignore" });
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
