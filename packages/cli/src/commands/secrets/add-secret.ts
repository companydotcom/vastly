import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { Client } from "../../util/client.js";
import doAddSecret from "../../util/secrets/add-secret.js";
import { Secret } from "../../types/index.js";

export default async function addSecret(client: Client) {
  const { output } = client;

  try {
    let spinner: Ora;

    const secret: any = await inquirer
      .prompt([
        {
          type: "text",
          name: "secretKey",
          message: "What is the name of your secret?",
        },
        {
          type: "password",
          name: "secretValue",
          message: "What is the value of your secret?",
          mask: "*",
        },
        {
          type: "text",
          name: "environment",
          message: "Which environment?",
        },
      ])
      .then((a: Secret) => ({
        environment: a.environment,
        secretKey: a.secretKey,
        secretValue: a.secretValue,
        // workspace: a.workspace,
      }))
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

    const response = await doAddSecret(client, secret);

    spinner.succeed(chalk.green("Success!"));
    return response;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
