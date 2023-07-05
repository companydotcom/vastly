import fs from "fs-extra";
import { type PackageJson } from "type-fest";
import { findUpSync } from "find-up";

// Based on https://github.com/sindresorhus/pkg-dir/tree/main
export function pkgUpSync({ cwd }: any = {}) {
  return findUpSync("package.json", { cwd });
}

export function getPackageInfo() {
  const packageJsonPath = pkgUpSync();

  return fs.readJSONSync(packageJsonPath || "") as PackageJson;
}
