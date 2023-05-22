import ora from "ora";
import chalk from "chalk";
import { errorToString } from "@vastly/utils";
import { Client } from "../../util/client.js";
import doAddEnv from "../../util/env/add.js";
import { doPullEnv } from "../../util/env/pull-all.js";

export default async function addEnv(client: Client) {
  const { output } = client;

  try {
    let spinner = output.spinner;

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

    const input = await client
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
          type: "confirm",
          name: "projectsConfirm",
          message: "Add a new project?",
          default: false,
          when: () => projects?.length,
        },
        {
          type: "text",
          name: "projects",
          message: "What is the name of your PROJECT?",
          choices: projects,
          when: (a) => !projects?.length || a.projectsConfirm,
        },
        {
          type: "list",
          name: "projects",
          message: "Choose a PROJECT to add to:",
          choices: projects,
          when: (a) => projects?.length && !a.projectsConfirm,
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

    const response = await doAddEnv(client, input);
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
