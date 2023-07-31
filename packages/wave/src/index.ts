#! /usr/bin/env node

import { Command } from "commander";
import * as Sentry from "@sentry/node";
import { WaveOptions } from "@vastly/types/index.js";
import { getPackageInfo } from "./util/config/get-package-info.js";
import { makeProgram } from "./command.js";

const program = new Command();

const pkg = getPackageInfo();

export const defineConfig = (options: WaveOptions) => options;

Sentry.init({
  dsn: "https://033b189965c244779dcf679e47a0133f@o4504997433180160.ingest.sentry.io/4505013895954432",
  release: `cli@${pkg.version}`,
});

try {
  const command = await makeProgram(program, pkg);

  if (typeof command === "number") {
    process.exitCode = command;
  } else {
    command.parse(process.argv);
  }
} catch (err) {
  // Recommended practice for node is set exitcode not force exit
  process.exitCode = 1;
}
