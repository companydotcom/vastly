import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import ora from "ora";
import chalk from "chalk";
import fse from "fs-extra";
import { satisfies } from "semver";
import { PackageManagerName, PACKAGE_MANAGERS } from "../types/index.js";
import { getPackageManagerVersion } from "./get-package-manager-version.js";

export const copyTemplate = async (packageManager: PackageManagerName): Promise<void> => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    const generateSpinner = ora({
      text: "Generating files with dxp-app generator...",
      color: "yellow",
    }).start();

    //copy template
    let sharedTemplate = path.resolve(__dirname, "../../src/templates", `_shared_ts`);
    fse.copySync(sharedTemplate, "./");

    //check package manager version is supported
    let packageManagerVersion = getPackageManagerVersion(packageManager);
    let packageManagerConfig = PACKAGE_MANAGERS[packageManager].find((packageManager) =>
      satisfies(packageManagerVersion, packageManager.semver),
    );

    if (!packageManagerConfig) {
      throw new Error("Unsupported package manager version.");
    }

    // copy the per-package-manager template
    let packageManagerTemplate = path.resolve(
      __dirname,
      "../../src/templates",
      packageManagerConfig.template,
    );
    if (fse.existsSync(packageManagerTemplate)) {
      fse.copySync(packageManagerTemplate, "./", {
        overwrite: true,
      });
    }

    generateSpinner.succeed(chalk.green("dxp-app generator completed successfully"));
  } catch (error) {
    console.error(error);
  }
};
