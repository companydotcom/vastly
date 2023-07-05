import fs from "fs-extra";
import { type PackageJson } from "type-fest";
import path from "path";
import { fileURLToPath } from "url";

export function getPackageInfo() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const rootPath = path.join(__dirname, "../../../package.json");

  return fs.readJSONSync(rootPath || "") as PackageJson;
}
