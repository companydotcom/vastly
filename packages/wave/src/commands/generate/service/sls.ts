import ora from "ora";
import chalk from "chalk";
import pkg from "fs-extra";
import { execSync } from "child_process";
import lodashPkg from "lodash";
import * as path from "path";
import { fileURLToPath } from "url";

import { Client } from "../../../util/client.js";

const { existsSync, readFile, writeFile, readJson, writeJson, ensureDir, copy, move } = pkg;
const { kebabCase, camelCase } = lodashPkg;

export const generateSlsService = async (client: Client, name: string, description: string) => {
  const { output } = client;
  let spinner = output.spinner;
  const kebabCaseServiceName = kebabCase(name);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const template = path.resolve(__dirname, "../../../../dist/templates/backend", "sls");

  try {
    // if (existsSync("./apps") && existsSync("./apps/client/package.json")) {
    spinner = ora({
      text: `Creating new service:  ${chalk.underline.cyan(`services/${kebabCaseServiceName}`)}`,
      color: "yellow",
    }).start();

    await ensureDir(`./services/${kebabCaseServiceName}`);
    await copy(template, `./services/${kebabCaseServiceName}`);
    await writeToBackendPackageJson(
      `./services/${kebabCaseServiceName}/package.json`,
      description,
      kebabCaseServiceName,
    );

    const serverlessContents = await readFile(
      `./services/${kebabCaseServiceName}/serverless.ts`,
      "utf-8",
    );
    const modifiedServerlessContents = serverlessContents.replace(
      'service: "${service-name}",',
      `service: "${kebabCaseServiceName}",`,
    );
    await writeFile(`./services/${kebabCaseServiceName}/serverless.ts`, modifiedServerlessContents);

    spinner.succeed();
    console.log(chalk.magenta(`/services/${kebabCaseServiceName}`));
    console.log(chalk.magenta(" |- /__tests__"));
    console.log(chalk.magenta(" |- /functions"));
    console.log(chalk.blueBright("    - hello-world.ts"));
    console.log(chalk.blueBright("    - index.ts"));
    console.log(chalk.magenta(" |- /package.json"));
    console.log(chalk.magenta(" |- README.md"));
    console.log(chalk.blueBright(" |- serverless.ts"));
    console.log(chalk.magenta(" |- tsconfig.json"));
    console.log(chalk.magenta(" |- vitest.config.ts"));
    // } else {
    //   spinner.fail("Please use the Vastly CLI from the root of your create-wave-app repo.");
    //   throw new Error("Please use the Vastly CLI from the root of your create-wave-app repo.");
    // }
  } catch (err) {
    console.error(err);
    return { success: false, message: `Something went wrong: ${err}` };
  }
};

const writeToBackendPackageJson = async (
  filePath: string,
  description: string,
  serviceName: string,
) => {
  try {
    const packageJson = await readJson(filePath);

    packageJson.name = serviceName;
    packageJson.description = description;

    await writeJson(filePath, packageJson, { spaces: 2 });
  } catch (error) {
    console.error("Error writing scripts and description to package.json:", error);
  }
};
