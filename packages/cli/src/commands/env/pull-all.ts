import fastGlob from "fast-glob";
import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { findUp } from "find-up";
import path from "node:path";
import { Client } from "../../util/client.js";
import doPullAllEnv from "../../util/env/get-all-secrets.js";
import writeToFile from "../../util/write-env-files.js";

export default async function pullAllEnv(client: Client) {
  const rootDir = path.dirname((await findUp(["apps", "services", "pnpm-workspace.yaml"])) || ".");
  const allDirs = await fastGlob(["apps/*/", "services/*/"], {
    cwd: rootDir,
    onlyDirectories: true,
    deep: 1,
  });

  const { output } = client;

  try {
    let spinner: Ora;

    const answers: { environment: string; directory: string[] } = await inquirer
      .prompt([
        {
          type: "list",
          name: "environment",
          message: "Which environment do you want to pull from?",
          choices: ["dev", "production"],
        },
        {
          type: "checkbox",
          name: "directory",
          message: "Which directory do you want to write to?",
          default: "root",
          choices: ["root", ...allDirs],
        },
      ])
      .then((a) => {
        console.log(a.directory);
        return a;
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          throw new Error("Interactive mode not supported");
        } else {
          // Something else went wrong
          output.error("something wrong");
        }
      });

    spinner = ora({
      text: `Fetching your variables for ${answers.environment}...\n`,
      color: "yellow",
    }).start();

    const response = await doPullAllEnv(client, answers);
    if (response?.length) {
      spinner.succeed(chalk.green(`Variables for ${answers.environment} successfully fetched!`));

      spinner = ora({
        text: "Creating .env file...\n",
        color: "magenta",
      }).start();

      await writeToFile(response, answers.directory);

      spinner.succeed(chalk.bgGreenBright(`File successfully created!\n`));
    } else {
      spinner.fail(
        chalk.bgYellowBright(
          `No variables or secrets stored for the ${answers.environment} environment found!`,
        ),
      );
    }
    return response;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
