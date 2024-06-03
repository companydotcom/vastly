import ora from "ora";
import chalk from "chalk";
import { Client } from "../../util/client.js";
import deleteVariable from "../../util/env/delete.js";
import { EnvVariable } from "../../types/index.js";
import { errorToString } from "@vastly/utils";
import { findOrCreateTable } from "../../util/env/find-or-create-table.js";
import { getAppsFromTable } from "../../util/env/pull-env-utils.js";
import listTableItems from "../../util/env/list-items.js";

export default async function deleteEnv(client: Client) {
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

      const listItems = await client
        .prompt([
          {
            type: "confirm",
            name: "list",
            message: "Would you like to view your table first?",
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

      const apps = await getAppsFromTable();

      const env: EnvVariable = await client
        .prompt([
          {
            type: "list",
            name: "app",
            message: "Which APP or SERVICE do you want to delete from?",
            choices: apps,
            default: apps?.[0],
            validate: (input) => (input.length ? true : "Please make a selection"),
          },
          {
            type: "input",
            name: "keyName",
            message: "What is the NAME of the variable you want to delete? (CASE SENSITIVE)",
            validate: (input) => (input !== "" ? true : "Please enter a keyName"),
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
        text: "Starting delete...\n",
        color: "yellow",
      }).start();

      const response = await deleteVariable(env);
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
    spinner.fail(chalk.bgMagentaBright("  No table found! Add an env to get started  \n"));
    throw new Error();
  } catch (err: unknown) {
    output.error(`Delete: ${errorToString(err)}`);
  }
}
