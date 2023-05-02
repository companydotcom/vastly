import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { Client } from "../../util/client.js";
import doDeleteSecret from "../../util/secrets/delete-secret.js";
import { Secret } from "../../types/index.js";

export default async function deleteSecret(client: Client) {
  const { output } = client;

  try {
    let spinner: Ora;

    const { environment, secretKey }: Secret = await inquirer
      .prompt([
        {
          type: "text",
          name: "secretKey",
          message: "What is the name of the secret you want to delete? (CASE SENSITIVE)",
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
      text: "Adding your secret to the database...\n",
      color: "yellow",
    }).start();

    const response = await doDeleteSecret(client, { secretKey, environment });
    spinner.succeed(chalk.green("Success!"));
    return response;
  } catch (err: unknown) {
    output.error(err as string);
  }
}