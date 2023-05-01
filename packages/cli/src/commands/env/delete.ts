import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { Client } from "../../util/client.js";
import doDeleteEnv from "../../util/env/delete.js";
import { EnvVariable } from "../../types/index.js";

export default async function deleteEnv(client: Client) {
  const { output } = client;

  try {
    let spinner: Ora;

    const { environment, keyName }: EnvVariable = await inquirer
      .prompt([
        {
          type: "text",
          name: "key",
          message: "What is the name of the variable you want to delete? (CASE SENSITIVE)",
        },
        {
          type: "text",
          name: "environment",
          message: "Which environment?",
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

    const response = await doDeleteEnv(client, { keyName, environment });
    spinner.succeed(chalk.green("Success!"));
    return response;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
