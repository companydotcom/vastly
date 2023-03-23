import { execSync } from "child_process"
import { PackageManagerName } from "../types"

export const getPackageManagerVersion = (command: PackageManagerName): string => {
  return execSync(`${command} --version`).toString().trim()
}
