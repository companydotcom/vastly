import ora from "ora";
import chalk from "chalk";
import { errorToString } from "@vastly/utils";
import { Client } from "../../util/client.js";
import { findUp } from "find-up";
import path from "node:path";
import fastGlob from "fast-glob";
import { findOrCreateTable } from "../../util/env/find-or-create-table.js";
import addVariable from "../../util/env/add.js";
import listTableItems from "../../util/env/list-items.js";

export default async function addEnv(client: Client) {
  const rootDir = path.dirname((await findUp(["apps", "packages", "services", "pnpm-workspace.yaml"])) || ".");
  const allDirs = await fastGlob(["apps/*/", "packages/*/", "services/*/"], {
    cwd: rootDir,
    onlyDirectories: true,
    deep: 1,
  });

  const { output } = client;
  let spinner = output.spinner;

  try {
    spinner = ora({
      text: `Checking for an env table...\n`,
      color: "yellow",
    }).start();

    const tableExists = await findOrCreateTable();
    if (tableExists) {
      spinner.succeed(chalk.green("Table Found! \n"));
      const answers = await client
        .prompt([
          {
            type: "list",
            name: "app",
            message: "Which APP or SERVICE would you like to add to?",
            choices: ["root", ...allDirs],
            default: "root",
          },
          {
            type: "input",
            name: "keyName",
            message: "What is the NAME of your environment variable?",
            validate: (input) => (input !== "" ? true : "Please enter a value"),
            error: "Please enter a value",
          },
          {
            type: "input",
            name: "keyValue",
            message: "What is the VALUE of your environment variable?",
            validate: (input) => (input !== "" ? true : "Please enter a value"),
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
        text: "Adding to the database...\n",
        color: "yellow",
      }).start();

      const response = await addVariable(answers);
      if (response.$metadata.httpStatusCode === 200) {
        spinner.succeed(chalk.green("Success! \n"));

        const listItems = await client
          .prompt([
            {
              type: "confirm",
              name: "list",
              message: "Would you like to view your table?",
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

        if (listItems.list) {
          await listTableItems();
        }
        return;
      }
      spinner.fail(chalk.bgMagentaBright("  Something went wrong \n"));
      throw new Error();
    }
    spinner.fail(chalk.bgMagentaBright("  No table found! Something went wrong  \n"));
    throw new Error();
  } catch (err: unknown) {
    spinner.fail();
    output.error(`Add Env: ${errorToString(err)}`);
  }
}
