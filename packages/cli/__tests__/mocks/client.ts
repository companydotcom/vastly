import chalk from "chalk";
import { Command } from "commander";
import { PassThrough } from "stream";
import { makeProgram } from "../../src/command";

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

  return {
    stdin,
    stdout,
    stderr,
    reset,
  };
}

export const mockClient = makeMockClient();

export type MockClient = ReturnType<typeof makeMockClient>;

beforeEach(() => {
  mockClient.reset();
});

const program = new Command();

export async function wave(args: string[], client?: MockClient) {
  const command = await makeProgram(program, client);

  if (typeof command === "number") {
    process.exitCode = command;
  } else {
    command.parse(args, { from: "user" });
  }
}
