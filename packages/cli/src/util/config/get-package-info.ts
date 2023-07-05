import path from "path";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";
import { findUpSync } from "find-up";

// Based on https://github.com/sindresorhus/pkg-dir/tree/main
export function findRoot({ cwd }: any = {}) {
  const filePath = findUpSync("package.json", { cwd });
  return filePath && path.dirname(filePath);
}

export function getPackageInfo() {
  const appRoot = findRoot();
  const packageJsonPath = path.join(appRoot || "./", "package.json");

  return fs.readJSONSync(packageJsonPath) as PackageJson;
}
