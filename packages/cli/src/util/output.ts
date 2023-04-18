import chalk from "chalk";

export interface OutputOptions {
  debugEnabled: boolean;
}

export default function makeOutput(opts: OutputOptions) {
  const { debugEnabled } = opts;

  const log = (str: string, color = chalk.grey) => {
    console.log(color(str));
  };

  const error = (str: string) => {
    console.log(`${chalk.red(`Error:`)} ${str}\n`);
  };

  const success = (str: string) => {
    console.log(`${chalk.green(`Success!`)} ${str}\n`);
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
  };
}

export type Output = ReturnType<typeof makeOutput>;
