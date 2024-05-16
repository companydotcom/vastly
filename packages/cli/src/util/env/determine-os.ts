import os from "node:os";

export function setEnvironmentVariables(secrets: any) {
  const OS = os.platform();
  switch (OS) {
    case "win32":
      setEnvironmentVariablesWindows(secrets);
      break;
    default:
      setEnvironmentVariablesUnix(secrets);
  }
}

function setEnvironmentVariablesUnix(secrets: { [key: string]: string }) {
  for (const [key, value] of Object.entries(secrets)) {
    process.env[key] = value;
  }
}

function setEnvironmentVariablesWindows(secrets: { [key: string]: string }) {
  const powershellScript = Object.entries(secrets)
    .map(([key, value]) => `$env:${key} = "${value}"`)
    .join(";");

  require("child_process").execSync(`powershell -Command "${powershellScript}"`, {
    stdio: "inherit",
  });
}
