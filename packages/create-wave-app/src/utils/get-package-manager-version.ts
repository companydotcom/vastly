import { execSync } from "child_process";
import { PackageManagerName } from "../types";

export const getPackageManagerVersion = (command: PackageManagerName): string => {
  try {
    if (!command) {
      throw Error(`Error getting ${command} version`);
    }
    return execSync(`${command} --version`).toString().trim();
  } catch (error) {
    console.error(error);
    return "";
  }
};
