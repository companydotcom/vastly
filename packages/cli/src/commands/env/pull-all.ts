import fastGlob from "fast-glob";
import ora from "ora";
import chalk from "chalk";
import { findUp } from "find-up";
import path from "node:path";
import { Client } from "../../util/client.js";
import { doPullEnv } from "../../util/env/pull-all.js";
import writeToFile from "../../util/write-env-files.js";
import { errorToString } from "@vastly/utils";

export default async function pullAllEnv(client: Client) {
  const rootDir = path.dirname((await findUp(["apps", "services", "pnpm-workspace.yaml"])) || ".");
  const allDirs = await fastGlob(["apps/*/", "services/*/"], {
    cwd: rootDir,
    onlyDirectories: true,
    deep: 1,
  });

  const { output } = client;

  try {
    let spinner = output.spinner;

    spinner = ora({
      text: `Fetching your projects...\n`,
      color: "yellow",
    }).start();

    // Grabs projects from data, throws error if no projects are found
    const projects = await doPullEnv(client, { eventType: "pull-projects" });
    if (!projects?.length) {
      spinner.fail(chalk.bgMagentaBright("  No projects found! Add an env to get started :D  \n"));
      throw new Error("Command failed with exit code 1");
    } else {
      spinner.succeed();
    }

    const answers = await client
      .prompt([
        {
          type: "list",
          name: "environment",
          message: "Which ENVIRONMENT do you want to pull from?",
          choices: ["dev", "production"],
        },
        {
          type: "list",
          name: "projects",
          message: "Which PROJECT do you want to pull from?",
          choices: projects,
          when: () => projects?.length,
        },
        {
          type: "checkbox",
          name: "directory",
          message: "Which directory do you want to write to?",
          choices: ["root", ...allDirs],
        },
      ])
      .then((a) => a)
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
          `No variables or secrets for the ${answers.environment} environment found!`,
        ),
      );
      throw Error();
    }
    return response;
  } catch (err: unknown) {
    output.error(errorToString(err));
  }
}
