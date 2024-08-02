import ora from "ora";
import chalk from "chalk";
import { findUp } from "find-up";
import path from "node:path";
import { Client } from "../../util/client.js";
import { getAllEnv, getAppsFromTable } from "../../util/env/pull-env-utils.js";
import writeToFile from "../../util/env/write-env-files.js";
import { errorToString } from "@vastly/utils";

/**
 * The --all flag is used for repo deployment and will write your envs to the root directory of the checked out repository
 * @param client
 * @returns
 */
export default async function pullAllEnv(client: Client, stage: string) {
  const rootDir = path.dirname(
    (await findUp(["apps", "packages", "services", "pnpm-workspace.yaml"])) || ".",
  );

  const { output } = client;
  let spinner = output.spinner;
  try {
    spinner = ora({
      text: `Fetching envs...\n`,
      color: "yellow",
    }).start();

    const response = await getAllEnv(stage);
    if (response?.length) {
      spinner.succeed(chalk.green(`Success! \n`));

      spinner = ora({
        text: "Creating .env file...\n",
        color: "magenta",
      }).start();

      const directory = await writeToFile(response, ["root"], ".env");
      spinner.succeed(chalk.bgGreenBright(`File successfully created!`));
      directory.forEach((dir) =>
        console.log(
          chalk.green(`.env File saved to `) +
            chalk.underline.cyan(`${dir === "root" ? rootDir : dir}`),
        ),
      );
    } else {
      spinner.fail(`Not found! There are no envs for ${chalk.magenta(stage)}`);
      return;
    }
  } catch (err: unknown) {
    output.error(`Pull Env: ${errorToString(err)}`);
  }
}
