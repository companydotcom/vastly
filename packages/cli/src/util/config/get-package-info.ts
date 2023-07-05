import fs from "fs-extra";
import { type PackageJson } from "type-fest";
import { findUpSync } from "find-up";

// Based on https://github.com/sindresorhus/pkg-dir/tree/main
export function pkgUpSync({ cwd }: any = {}) {
  return findUpSync("package.json", { cwd });
}

export function getPackageInfo() {
  const rootPath = pkgUpSync({ cwd: import.meta.url }) as string;

  return fs.readJSONSync(rootPath || "") as PackageJson;
}
