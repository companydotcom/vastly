import { Argument, Command } from "commander";
import { mkdirp } from "fs-extra";
import { Config } from "@vastly/types";
import { errorToString, isErrnoException } from "@vastly/utils";
import type { PackageJson } from "type-fest";
import {
  readVastlyConfigFile,
  readWaveConfigFile,
  writeToConfigFile,
  getConfigFilePath,
} from "./util/config/files.js";
import getGlobalPathConfig from "./util/config/files.js";
import { defaultConfig } from "./util/config/defaults.js";

const makeClient = await import("./util/client.js");
const makeOutput = await import("./util/output/create-output.js");

const VASTLY_CONFIG_PATH = getConfigFilePath();
const VASTLY_DIR = getGlobalPathConfig();

export async function makeProgram(program: Command, pkg: PackageJson) {
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
    config = readVastlyConfigFile();
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
    waveConfig: undefined,
    apiUrl: "https://lenz62zq97.execute-api.us-east-1.amazonaws.com/prod",
  });

  try {
    const waveConfig = await readWaveConfigFile(process.cwd());
    client.waveConfig = waveConfig.data;
  } catch (err: unknown) {
    output.error(
      `An unexpected error occurred while trying to read the wave.config.ts file in "${process.cwd()}" -- ${errorToString(
        err,
      )}`,
    );
    return 1;
  }

  program
    .name("wave")
    .description("CLI for Wave")
    .version(`${pkg.version}`)
    .option("-d, --debug", "outputs extra debugging", false);

  program
    .command("dev")
    .description("Run your Wave app locally")
    .action(async () => {
      const func = (await import("./commands/dev/index.js")).default;
      await func(client);
    });

  program
    .command("deploy")
    .description("Deploy your wave app")
    .addArgument(new Argument("<action>", "deploy options").choices(["amplify", "sst"]))
    .action(async (arg) => {
      const func = (await import("./commands/deploy/index.js")).default;
      await func(client, arg);
    });

  program
    .command("generate")
    .description("Generate a Microservice")
    .addArgument(new Argument("<action>", "generate options").choices(["service", "ciam"]))
    .action(async (arg) => {
      const func = (await import("./commands/generate/index.js")).default;
      await func(client, arg);
    });

  program
    .command("codegen")
    .description("Generate GraphQL types and front-end hooks")
    .action(async (arg) => {
      const func = (await import("./commands/codegen/index.js")).default;
      await func(client);
    });

  return program;
}
