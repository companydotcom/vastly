import { Argument, Command } from "commander";
import { mkdirp } from "fs-extra";
import { Config } from "@vastly/types";
import chalk from "chalk";
import { errorToString, isErrnoException } from "@vastly/utils";
import type { PackageJson } from "type-fest";
import latestVersion from "latest-version";

import { readConfigFile, writeToConfigFile, getConfigFilePath } from "./util/config/files.js";
import getGlobalPathConfig from "./util/config/files.js";
import { defaultConfig } from "./util/config/defaults.js";
import { type Stage } from "./types/index.js";

const makeClient = await import("./util/client.js");
const makeOutput = await import("./util/output/create-output.js");

const VASTLY_CONFIG_PATH = getConfigFilePath();
const VASTLY_DIR = getGlobalPathConfig();

const { CLIENT_API_URL } = process.env;

export async function makeProgram(program: Command, pkg: PackageJson) {
  const options = program.opts();
  const output = makeOutput.default({ stream: process.stderr, debugEnabled: options.debug });

  try {
    const lv = await latestVersion("@vastly/cli");
    if (pkg.version && lv !== pkg.version) {
      output.log(
        `${chalk.green("Update available!")} ${chalk.red(pkg.version)} -> ${chalk.yellowBright.bold(lv)} \nRun ${chalk.cyan.inverse("pnpm add -g @vastly/cli")} to update \n`,
      );
    }
  } catch (e) {
    return 1;
  }

  // Make sure global config dir exists
  try {
    await mkdirp(VASTLY_DIR);
  } catch (err: unknown) {
    output.error(`Couldn't create the global directory at ${VASTLY_DIR} ${errorToString(err)}`);
    return 1;
  }

  let config: Config | undefined;
  try {
    config = readConfigFile();
  } catch (err: unknown) {
    if (isErrnoException(err) && err.code === "ENOENT") {
      config = defaultConfig;
      try {
        writeToConfigFile(config);
      } catch (err: unknown) {
        output.error(
          `An unexpected error occurred while trying to save the config to "${VASTLY_CONFIG_PATH}" ${errorToString(
            err,
          )}`,
        );
        return 1;
      }
    } else {
      output.error(
        `An unexpected error occurred while trying to read the config in "${VASTLY_CONFIG_PATH}" ${errorToString(
          err,
        )}`,
      );
      return 1;
    }
  }

  const client = makeClient.default({
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    output,
    config,
    apiUrl: CLIENT_API_URL || "",
  });
  const allowableStages: Stage[] = ["sandbox", "local", "uat", "prod", "production"];

  program
    .name("vastly")
    .description("CLI for Vastly")
    .version(`${pkg.version}`)
    .option("-d, --debug", "outputs extra debugging", false);

  program
    .command("login")
    .description("Log into Vastly")
    .action(async () => {
      const func = (await import("./commands/login.js")).default;
      await func(client);
    });

  program
    .command("logout")
    .description("Log out of Vastly")
    .action(async () => {
      const func = (await import("./commands/logout.js")).default;
      await func(client);
    });

  program
    .command("env")
    .description("Manage your environment variables")
    .addArgument(new Argument("<action>", "Env options").choices(["add", "delete", "pull"]))
    .option("-a, --all", "Pull all environment variables")
    .requiredOption("-st, --stage <stage>", "Pass a stage argument to add, delete, or pull from")
    .action(async (action: string, options: { stage: Stage; all?: boolean }) => {
      if (options.stage && !allowableStages.includes(options.stage)) {
        console.log(
          `${chalk.red(`Invalid stage! Your choices are ${chalk.inverse(allowableStages.join(", "))}`)}`,
        );
        process.exit(1);
      }
      if (options.stage === "production") {
        options.stage = "prod";
      }
      const func = (await import("./commands/env/index.js")).default;
      await func(client, action, options);
    });

  program
    .command("whoami")
    .description("Display the username of the currently logged in user")
    .option("-t, --token", "Returns your current token from user config")
    .action(async (_args: any, options) => {
      const func = (await import("./commands/whoami.js")).default;

      await func(client, options.opts());
    });

  return program;
}
