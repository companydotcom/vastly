import fastGlob from "fast-glob";
import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { findUp } from "find-up";
import path from "node:path";
import { Client } from "../../util/client.js";
import { doPullEnv } from "../../util/env/pull-all.js";
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

    spinner = ora({
      text: `Fetching your projects...\n`,
      color: "yellow",
    }).start();

    // Grabs projects from data
    const projects = await doPullEnv(client, { eventType: "pull-projects" });
    if (!projects.length) {
      spinner.fail(chalk.bgMagentaBright("  No projects found! Add an env to get started :D  "));
      throw new Error("Command failed with exit code 1");
    }

    const answers = await inquirer
      .prompt([
        {
          type: "list",
          name: "projects",
          message: "Which PROJECT do you want to pull from?",
          choices: projects,
        },
        {
          type: "list",
          name: "environment",
          message: "Which ENVIRONMENT do you want to pull from?",
          choices: ["dev", "production"],
        },
        {
          type: "checkbox",
          name: "directory",
          message: "Which directory do you want to write to?",
          default: ["root"],
          choices: ["root", ...allDirs],
        },
      ])
      .then((a) => {
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
      text: `Fetching your variables for ${answers.projects}#${answers.environment}...\n`,
      color: "yellow",
    }).start();

    const response = await doPullEnv(client, { eventType: "pull-env", ...answers });
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
