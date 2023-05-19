#! /usr/bin/env node

import { Command } from "commander";
import * as Sentry from "@sentry/node";
import { getPackageInfo } from "./util/config/get-package-info.js";
import { makeProgram } from "./command.js";

const program = new Command();

const pkg = getPackageInfo();

Sentry.init({
  dsn: "https://033b189965c244779dcf679e47a0133f@o4504997433180160.ingest.sentry.io/4505013895954432",
  release: `vastly-cli@${pkg.version}`,
});

try {
  const command = await makeProgram(program);

  if (typeof command === "number") {
    process.exitCode = command;
  } else {
    command.parse(process.argv);
  }
} catch (err) {
  // Recommended practice for node is set exitcode not force exit
  process.exitCode = 1;
}
