import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { Client } from "../../util/client.js";
import doAddEnv from "../../util/env/add.js";
import { EnvVariable } from "../../types/index.js";

export default async function addEnv(client: Client) {
  const { output } = client;

  try {
    let spinner: Ora;

    const input: any = await inquirer
      .prompt([
        {
          type: "text",
          name: "key",
          message: "What is the name of your env variable?",
        },
        {
          type: "password",
          name: "value",
          message: "What is the value of your env variable?",
          mask: "*",
        },
        {
          type: "text",
          name: "environment",
          message: "Which environment?",
        },
        {
          type: "text",
          name: "project",
          message: "Which project?",
        },
      ])
      .then((a: EnvVariable) => ({
        environment: a.environment,
        key: a.key,
        value: a.value,
        project: a.project,
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
      text: "Adding to the database...\n",
      color: "yellow",
    }).start();

    const response = await doAddEnv(client, input);

    spinner.succeed(chalk.green("Success!"));
    return response;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
