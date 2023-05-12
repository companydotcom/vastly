import { Command } from "commander";
import { getPackageInfo } from "./util/config/get-package-info.js";

const pkg = getPackageInfo();

export function makeProgram(options?: {
  exitOverride?: boolean;
  suppressOutput?: boolean;
}): Command {
  const program = new Command();

  // Configuration
  if (options?.exitOverride) {
    program.exitOverride();
  }
  if (options?.suppressOutput) {
    program.configureOutput({
      writeOut: () => {},
      writeErr: () => {},
    });
  }

  return program;
}

export function wave(args: string[], opts?: { suppressOutput?: boolean }): void {
  makeProgram({ exitOverride: true, suppressOutput: opts?.suppressOutput }).parse(args, {
    from: "user",
  });
}
