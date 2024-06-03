import fastGlob from "fast-glob";
import ora from "ora";
import chalk from "chalk";
import { findUp } from "find-up";
import path from "node:path";
import { Client } from "../../util/client.js";
import { getEnvsPerApp, getAppsFromTable } from "../../util/env/pull-env-utils.js";
import writeToFile from "../../util/env/write-env-files.js";
import { errorToString } from "@vastly/utils";
import { findOrCreateTable } from "../../util/env/find-or-create-table.js";

export default async function pullEnv(client: Client) {
  const rootDir = path.dirname(
    (await findUp(["apps", "packages", "services", "pnpm-workspace.yaml"])) || ".",
  );
  const allDirs = await fastGlob(["apps/*/", "packages/*/", "services/*/"], {
    cwd: rootDir,
    onlyDirectories: true,
    deep: 1,
  });

  const { output } = client;
  let spinner = output.spinner;

  spinner = ora({
    text: `Checking for an env table...\n`,
    color: "yellow",
  }).start();
  try {
    const tableExists = await findOrCreateTable();
    if (tableExists) {
      spinner.succeed(chalk.green("Table Found! \n"));

      const apps = await getAppsFromTable();
      const answers = await client
        .prompt([
          {
            type: "list",
            name: "app",
            message: "Which APP or SERVICE do you want to pull from?",
            choices: apps,
            default: apps?.[0],
          },
          {
            type: "input",
            name: "fileName",
            message: "Input your env file name:",
            default: ".env.local",
          },
          {
            type: "checkbox",
            name: "directory",
            message: "Choose a directory to write to:",
            choices: ["root", ...allDirs],
            validate: (input) => (input.length ? true : "You must choose at least one directory"),
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
        text: `Fetching variables for ${answers.app}...\n`,
        color: "yellow",
      }).start();

      const response = await getEnvsPerApp(answers.app);
      if (response?.length) {
        spinner.succeed(chalk.green(`Success! \n`));

        spinner = ora({
          text: "Creating .env file...\n",
          color: "magenta",
        }).start();

        const directory = await writeToFile(response, answers.directory, answers.fileName);
        spinner.succeed(chalk.bgGreenBright(`File successfully created!\n`));
        directory.forEach((dir) =>
          console.log(
            chalk.green(`File saved to `) +
              chalk.underline.cyan(`${dir === "root" ? rootDir : dir}`),
          ),
        );
      }
      return;
    }
    spinner.fail(chalk.bgMagentaBright("  No table found! Add an env to get started  \n"));
    throw new Error();
  } catch (err: unknown) {
    output.error(`Pull Env: ${errorToString(err)}`);
  }
}
