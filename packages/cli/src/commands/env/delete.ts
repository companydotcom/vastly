import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { Client } from "../../util/client.js";
import doDeleteEnv from "../../util/env/delete.js";
import { EnvVariable } from "../../types/index.js";
import { doPullEnv } from "../../util/env/pull-all.js";
import { errorToString } from "@companydotcom/utils";

export default async function deleteEnv(client: Client) {
  const { output } = client;

  try {
    let spinner = output.spinner;

    spinner = ora({
      text: `Fetching your keys...\n`,
      color: "yellow",
    }).start();

    // Grabs projects from data, throws error if no projects are found
    const projects = await doPullEnv(client, { eventType: "pull-projects" });
    if (!projects?.length) {
      spinner.fail(
        chalk.bgMagentaBright("  No secrets or env found! Add an env to get started :D  \n"),
      );
      throw new Error("Command failed with exit code 1");
    } else {
      spinner.succeed();
    }

    const env: EnvVariable = await inquirer
      .prompt([
        {
          type: "list",
          name: "environment",
          message: "Which ENVIRONMENT do you want to delete from?",
          choices: ["dev", "prod"],
        },
        {
          type: "list",
          name: "projects",
          message: "Which PROJECT do you want to delete from?",
          choices: projects,
          when: () => projects.length,
        },
        {
          type: "text",
          name: "keyName",
          message: "What is the NAME of the variable you want to delete? (CASE SENSITIVE)",
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
      text: "Deleting...\n",
      color: "yellow",
    }).start();

    const response = await doDeleteEnv(client, env);
    if (response?.message.includes("Error")) {
      spinner.stop();
      throw Error(response.message);
    }
    spinner.succeed(chalk.green("Success!"));
    return response;
  } catch (err: unknown) {
    output.error(errorToString(err));
  }
}
