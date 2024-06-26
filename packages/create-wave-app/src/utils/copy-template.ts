import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import ora, { Ora } from "ora";
import chalk from "chalk";
import pkg from "fs-extra";
import { satisfies } from "semver";
import { PackageManagerName, PACKAGE_MANAGERS, GeneratorResponse } from "../types/index.js";
import { getPackageManagerVersion } from "./get-package-manager-version.js";
const { copy, exists, writeFile, readFile, move } = pkg;

export const copyTemplate = async (
  packageManager: PackageManagerName,
  { repoName, repoDescription }: { repoName: string; repoDescription: string },
): Promise<GeneratorResponse> => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  let spinner: Ora;
  spinner = ora({
    text: "Generating files with wave-app generator...",
    color: "yellow",
  }).start();
  try {
    //copy template
    let sharedTemplate = path.resolve(__dirname, "../../dist/templates", "_shared_ts");
    await copy(sharedTemplate, "./");
    await copy("./apps/client/_gitignore", "./apps/client/.gitignore");
    await move("./apps/client/_gitignore", "./.gitignore");

    //check package manager version is supported
    let packageManagerVersion = getPackageManagerVersion(packageManager);
    let packageManagerConfig = PACKAGE_MANAGERS[packageManager]?.find((packageManager) =>
      satisfies(packageManagerVersion, packageManager.semver),
    );

    if (!packageManagerConfig) {
      throw new Error("Unsupported package manager version.");
    }

    // copy the package manager template and replace temp values
    let packageManagerTemplatePath = path.resolve(
      __dirname,
      "../../dist/templates",
      packageManagerConfig.template,
    );

    if (await exists(packageManagerTemplatePath)) {
      await copy(packageManagerTemplatePath, "./");
      const templateContents = await readFile(
        `${packageManagerTemplatePath}/package.json`,
        "utf-8",
      );

      const modifiedTemplateContents = templateContents
        .replace("<%= appName %>", repoName.toLowerCase().replace(/\s+/g, "-"))
        .replace("<%= description %>", repoDescription);
      await writeFile(`./package.json`, modifiedTemplateContents);
    }

    // update wave config
    let configContents = await readFile("./wave.config.ts", "utf-8");
    // appName will be used in CloudFormation stack names,
    // need to make sure it's valid
    configContents = configContents.replace(
      "<%= appName %>",
      repoName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^A-Za-z0-9-]/g, ""),
    );
    await writeFile("./wave.config.ts", configContents);

    spinner.succeed(chalk.green("wave-app generator completed successfully"));
    return { success: true };
  } catch (error) {
    console.error(error);
    spinner.fail("Something went wrong!");
    return { success: false, message: `Something went wrong: ${error}` };
  }
};
