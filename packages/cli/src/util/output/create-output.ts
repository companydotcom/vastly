import chalk from "chalk";
import ora from "ora";
import { Writable } from "stream";

export interface OutputOptions {
  stream: Writable;
  debugEnabled: boolean;
}

export default function makeOutput(opts: OutputOptions) {
  const { debugEnabled, stream } = opts;
  let spinner = ora();

  const print = (str: string) => {
    spinner.stop();
    stream.write(str);
  };

  const log = (str: string, color = chalk.grey) => {
    print(color(str));
  };

  const error = (str: string) => {
    print(`${chalk.red(`Error:`)} ${str}\n`);
  };

  const success = (str: string) => {
    print(`${chalk.green(`Success!`)} ${str}\n`);
  };

  const debug = (str: string) => {
    if (debugEnabled) {
      log(`${chalk.bold("[debug]")} ${chalk.gray(`[${new Date().toISOString()}]`)} ${str}`);
    }
  };

  return {
    log,
    error,
    debug,
    success,
    print,
    spinner,
  };
}

export type Output = ReturnType<typeof makeOutput>;
