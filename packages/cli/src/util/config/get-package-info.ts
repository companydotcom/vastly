import path from "path";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

export function getPackageInfo() {
  let packageJsonPath = "";

  if (fs.existsSync("dist/package.json")) {
    packageJsonPath = path.join("dist/package.json");
  } else {
    packageJsonPath = path.join("package.json");
  }

  return fs.readJSONSync(packageJsonPath) as PackageJson;
}
