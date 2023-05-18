#! /usr/bin/env node

import { Argument, Command } from "commander";
import { mkdirp } from "fs-extra";
import { errorToString, isErrnoException } from "@companydotcom/utils";
import { Client } from "./util/client.js";
import { readConfigFile, writeToConfigFile, getConfigFilePath } from "./util/config/files.js";
import { Config } from "./types/index.js";
import getGlobalPathConfig from "./util/config/files.js";
import { defaultConfig } from "./util/config/defaults.js";
import { MockClient } from "../__tests__/mocks/client.js";

const makeClient = await import("./util/client.js");
const makeOutput = await import("./util/output/create-output.js");

const VASTLY_CONFIG_PATH = getConfigFilePath();
const VASTLY_DIR = getGlobalPathConfig();

export async function makeProgram(program: Command, mockClient?: MockClient) {
  const options = program.opts();
  const output = makeOutput.default({ stream: process.stderr, debugEnabled: options.debug });

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

  const client =
    mockClient ||
    makeClient.default({
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      output,
      config,
      apiUrl: "https://gxmblcgqcb.execute-api.us-east-1.amazonaws.com",
    });

  program
    .name("vastly")
    .description("CLI for Vastly")
    .version("0.0.1")
    .option("-d, --debug", "outputs extra debugging", false);

  program
    .command("login")
    .description("Log into company.com")
    .action(async () => {
      const func = (await import("./commands/login.js")).default;
      // @ts-ignore
      await func(client);
    });

  program
    .command("logout")
    .description("Log out of company.com")
    .action(async () => {
      const func = (await import("./commands/logout.js")).default;
      // @ts-ignore
      await func(client);
    });

  program
    .command("env")
    .description("Log out of company.com")
    .addArgument(new Argument("<action>", "drink cup size").choices(["add", "delete", "pull"]))
    .action(async (arg) => {
      const func = (await import("./commands/env/index.js")).default;
      // @ts-ignore
      await func(client, arg);
    });

  return program;
}
