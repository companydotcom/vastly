import { PassThrough } from "stream";
import chalk from "chalk";
import { Command } from "commander";

// Disable colors in `chalk` so that tests don't need
// to worry about ANSI codes
chalk.level = 0;

export function makeMockClient() {
  let stdin = new PassThrough();
  let stdout = new PassThrough();
  let stderr = new PassThrough();

  function reset() {
    stdin = new PassThrough();
    stdout = new PassThrough();
    stdout.setEncoding("utf8");
    stdout.end = () => stdout;
    stdout.pause();

    stderr = new PassThrough();
    stderr.setEncoding("utf8");
    stderr.end = () => stderr;
    stderr.pause();
  }

  function setArgv(...argv: string[]) {
    // const program = new Command();

    argv = [process.execPath, "cli.js", ...argv];
    // this.output = new Output(this.stderr, {
    //   debug: argv.includes('--debug') || argv.includes('-d'),
    //   noColor: argv.includes('--no-color'),
    // });
  }

  return {
    stdin,
    stdout,
    stderr,
    reset,
    setArgv,
  };
}

export const mockClient = makeMockClient();

beforeEach(() => {
  mockClient.reset();
});
