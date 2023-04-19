import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { Client } from "../../util/client.js";
import doGetSecret from "../../util/secrets/get-secret.js";

export default async function getSecret(client: Client) {
  const { output } = client;

  try {
    let spinner: Ora;

    const environment: string = await inquirer
      .prompt([
        {
          type: "text",
          name: "environment",
          message: "Which environment?",
        },
      ])
      .then((a) => a.environment)
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          throw new Error("Interactive mode not supported");
        } else {
          // Something else went wrong
          output.error("something wrong");
        }
      });

    const response = await doGetSecret(client, environment);

    spinner = ora({
      text: `Fetching your secrets for ${environment}\n`,
      color: "yellow",
    }).start();

    spinner.succeed(chalk.green("Success!"));
    return response;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
