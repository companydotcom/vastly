#! /usr/bin/env node

import { Argument, Command, Option } from "commander";
import chalk from "chalk";
import { mkdirp } from "fs-extra";
import { errorToString, isErrnoException } from "@companydotcom/utils";
import * as Sentry from "@sentry/node";
import getGlobalPathConfig from "./util/config/files.js";
import { readConfigFile, writeToConfigFile, getConfigFilePath } from "./util/config/files.js";
import { Config } from "./types/index.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

Sentry.init({
  dsn: "https://033b189965c244779dcf679e47a0133f@o4504997433180160.ingest.sentry.io/4505013895954432",
  release: `vastly-cli@${pkg.version}`,
});

const VASTLY_DIR = getGlobalPathConfig();
const VASTLY_CONFIG_PATH = getConfigFilePath();

const main = async () => {
  const clientUtil = await import("./util/client.js");
  const outputUtil = await import("./util/output.js");
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
  const output = outputUtil.default({ debugEnabled: options.debug });

  // Make sure global config dir exists
  try {
    await mkdirp(VASTLY_DIR);
  } catch (err: unknown) {
    output.error(`Couldn't create the global directory at ${VASTLY_DIR} ${errorToString(err)}`);
    return;
  }

  let config: Config;
  try {
    // @ts-ignore
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

  const client = clientUtil.default({
    program: commander,
    output,
  });

  const subcommand = program.args[1];

  // Check if there are no arguments.
  if (!subcommand || !process.argv.slice(2)) {
    // Display the application help.
    program.outputHelp();
  }

  try {
    let func: any;
    let description: string;
    let argument: Argument | any;

    switch (subcommand) {
      case "login":
        description = "Log into company.com";
        func = (await import("./commands/login.js")).default;
        break;
      case "logout":
        description = "Log out of company.com";
        func = (await import("./commands/logout.js")).default;
        break;
      case "env":
        description = "Add, delete, or pull all stored env variables";
        func = (await import("./commands/env/index.js")).default;
        argument = new Argument("<action>", "Preferred action to preform on a variable").choices([
          "add",
          "delete",
          "pull",
        ]); // This is not a permanent solution
        break;
      default:
        description = "";
        func = null;
        break;
    }

    if (!func || !subcommand) {
      console.log(`${chalk.red("That subcommand does not exist!")}`);
      return 1;
    }

    commander
      .command(subcommand)
      .description(description)
      .addArgument(argument ?? "")
      .action(async (arg) => {
        await func(client, arg);
      });
  } catch (err: unknown) {
    console.log(`${chalk.red("Unknown error", err)}`);
  }
  program.parse();
};

main().catch((err: Error) => {
  console.error(`An unexpected error occurred!\n${err.stack}`);
});
