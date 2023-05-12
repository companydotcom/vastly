#! /usr/bin/env node

import { Argument, Command } from "commander";
import chalk from "chalk";
import { mkdirp } from "fs-extra";
import { errorToString, isErrnoException } from "@companydotcom/utils";
import * as Sentry from "@sentry/node";
import getGlobalPathConfig from "./util/config/files.js";
import { readConfigFile, writeToConfigFile, getConfigFilePath } from "./util/config/files.js";
import { Config } from "./types/index.js";
import { getPackageInfo } from "./util/config/get-package-info.js";

const pkg = getPackageInfo();

Sentry.init({
  dsn: "https://033b189965c244779dcf679e47a0133f@o4504997433180160.ingest.sentry.io/4505013895954432",
  release: `vastly-cli@${pkg.version}`,
});

const VASTLY_DIR = getGlobalPathConfig();
const VASTLY_CONFIG_PATH = getConfigFilePath();

const main = async () => {
  const clientUtil = await import("./util/client.js");
  const outputUtil = await import("./util/output/create-output.js");
  const program = new Command();

  program
    .name("vastly")
    .description("CLI for Vastly")
    .version("0.0.1")
    .option("-d, --debug", "outputs extra debugging", false);

  program.parse(process.argv);
  // Top level command for the CLI
  const commander = program.command("vastly");
  const options = commander.opts();
  const output = outputUtil.default({ stream: process.stderr, debugEnabled: options.debug });

  // Make sure global config dir exists
  try {
    await mkdirp(VASTLY_DIR);
  } catch (err: unknown) {
    output.error(`Couldn't create the global directory at ${VASTLY_DIR} ${errorToString(err)}`);
    return;
  }

  let config: Config;
  try {
    config = readConfigFile();
  } catch (err: unknown) {
    if (isErrnoException(err) && err.code === "ENOENT") {
      config = { token: "working" };
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

  // Shared client instance for all subcommands to use
  const client = clientUtil.default({
    program: commander,
    output,
    config,
    apiUrl: "https://gxmblcgqcb.execute-api.us-east-1.amazonaws.com",
  });

  const subcommand = program.args[1];

  // Check if there are no arguments.
  if (!subcommand || !process.argv.slice(2)) {
    // Display the application help.
    program.outputHelp();
  }

  try {
    switch (subcommand) {
      case "login":
        commander
          .command(subcommand)
          .description("Log into company.com")
          .action(async () => {
            const func = (await import("./commands/login.js")).default;
            await func(client);
          });
        break;
      case "logout":
        commander
          .command(subcommand)
          .description("Log out of company.com")
          .action(async () => {
            const func = (await import("./commands/logout.js")).default;
            await func(client);
          });
        break;
      case "env":
        commander
          .command(subcommand)
          .description("Log out of company.com")
          .addArgument(
            new Argument("<action>", "drink cup size").choices(["add", "delete", "pull"]),
          )
          .action(async (arg) => {
            const func = (await import("./commands/env/index.js")).default;
            await func(client, arg);
          });

        break;
      default:
        console.log(`${chalk.red("That subcommand does not exist!")}`);
        return 1;
    }
  } catch (err: unknown) {
    console.log(`${chalk.red("Unknown error", err)}`);
  }
  program.parse();
};

main().catch((err: Error) => {
  // Recommended practice for node is set exitcode not force exit
  console.error(`An unexpected error occurred!\n${err.stack}`);
  process.exitCode = 1;
});
