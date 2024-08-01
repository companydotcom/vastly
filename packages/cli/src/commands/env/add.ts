import ora from "ora";
import chalk from "chalk";
import { errorToString } from "@vastly/utils";
import { PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Client } from "../../util/client.js";
import { findUp } from "find-up";
import path from "node:path";
import fastGlob from "fast-glob";
import { findOrCreateTable } from "../../util/env/find-or-create-table.js";
import addVariable from "../../util/env/add.js";
import addVariableBulk from "../../util/env/add-bulk.js";
import listTableItems from "../../util/env/list-items.js";

export default async function addEnv(client: Client, stage: string) {
  const rootDir = path.dirname(
    (await findUp(["apps", "packages", "services", "pnpm-workspace.yaml"])) || ".",
  );
  const allDirs = await fastGlob(["apps/*/", "packages/*/", "services/*/"], {
    cwd: rootDir,
    onlyDirectories: true,
    deep: 1,
  });

  const { output } = client;
  let spinner = output.spinner;

  spinner = ora({
    text: `Checking for an env table...\n`,
    color: "yellow",
  }).start();
  try {
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
            type: "list",
            name: "bulkOrSingle",
            message: "Would you like add a single environment variable or from a file?",
            choices: ["single", "file"],
            default: "single",
          },
          {
            type: "input",
            name: "keyName",
            message: "What is the NAME of your environment variable?",
            validate: (input) => (input !== "" ? true : "Please enter a value"),
            when: (a) => a.bulkOrSingle === "single",
            error: "Please enter a value",
          },
          {
            type: "input",
            name: "keyValue",
            message: "What is the VALUE of your environment variable?",
            validate: (input) => (input !== "" ? true : "Please enter a value"),
            when: (a) => a.bulkOrSingle === "single",
          },
          {
            type: "input",
            name: "filePath",
            message: "Please enter the file path for your .env file.",
            validate: (input) => (input !== "" ? true : "Please enter a value"),
            when: (a) => a.bulkOrSingle === "file",
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

      let response;

      if (answers?.bulkOrSingle === "single") {
        response = await addVariable(answers, stage);
      } else {
        response = await addVariableBulk(answers, stage);
      }

      if (
        (answers?.bulkOrSingle === "single" && response?.$metadata?.httpStatusCode === 200) ||
        (answers?.bulkOrSingle === "file" &&
          response?.every((r: PutCommandOutput) => r?.$metadata?.httpStatusCode === 200))
      ) {
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
    output.error(`Add Env: ${errorToString(err)}`);
  }
}
