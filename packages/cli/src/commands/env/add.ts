import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { Client } from "../../util/client.js";
import doAddEnv from "../../util/env/add.js";
import { EnvVariable } from "../../types/index.js";
import { doPullEnv } from "../../util/env/pull-all.js";

export default async function addEnv(client: Client) {
  const { output } = client;

  try {
    let spinner: Ora;

    spinner = ora({
      text: `Fetching your projects...\n`,
      color: "yellow",
    }).start();

    let projects = await doPullEnv(client, { eventType: "pull-projects" });
    if (!projects?.length) {
      spinner.succeed(
        chalk.bgMagentaBright(
          "  No projects found! Let's get started adding a new env variable :D  \n",
        ),
      );
      projects = [];
    } else {
      spinner.succeed();
    }

    const input: any = await inquirer
      .prompt([
        {
          type: "text",
          name: "keyName",
          message: "What is the NAME of your env variable?",
        },
        {
          type: "password",
          name: "keyValue",
          message: "What is the VALUE of your env variable?",
          mask: "*",
        },
        {
          type: "list",
          name: "environment",
          message: "Which ENVIRONMENT is this for?",
          choices: ["dev", "prod"],
        },
        {
          type: "text",
          name: "projects",
          message: "What is the name of your PROJECT?",
          choices: projects,
          when: () => !projects?.length,
        },
        {
          type: "list",
          name: "projects",
          message: "Which PROJECT is this for?",
          choices: projects,
          when: () => projects?.length,
        },
      ])
      .then((a: EnvVariable) => ({ ...a, projects: a.projects?.toLowerCase() }))
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
