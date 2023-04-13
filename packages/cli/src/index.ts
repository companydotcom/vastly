#! /usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import fs from "fs"
const fsPromises = fs.promises
import makeClient from "./util/client.js"
import makeOutput from "./util/output.js"
import getGlobalPathConfig from "./util/config/files.js"

const VASTLY_DIR = getGlobalPathConfig()

const main = async () => {
  const program = new Command()

  program
    .name("vastly")
    .description("CLI for Vastly")
    .version("0.0.1")
    .option("-d, --debug", "outputs extra debugging", false)

  program.parse(process.argv)
  // Top level command for the CLI
  const commander = program.command("vastly")
  const options = program.opts()
  const output = makeOutput({ debugEnabled: options.debug })

  // Make sure global config dir exists
  try {
    await fsPromises.mkdir(VASTLY_DIR, { recursive: true })
  } catch (err: unknown) {
    output.error(`Couldn't create the global directory at ${VASTLY_DIR}`)
    return 1
  }

  const client = makeClient({
    program: commander,
    output,
  })

  const subcommand = program.args[1]

  // Check if there are no arguments.
  if (!subcommand || !process.argv.slice(2)) {
    // Display the application help.
    program.outputHelp()
  }

  try {
    let func: any
    let description: string

    switch (subcommand) {
      case "login":
        description = "Log into company.com"
        func = (await import("./commands/login.js")).default
        break
      case "logout":
        description = "Log out of company.com"
        func = (await import("./commands/logout.js")).default
        break
      default:
        description = ""
        func = null
        break
    }

    if (!func || !subcommand) {
      console.log(`${chalk.red("That subcommand does not exist!")}`)
      return 1
    }

    commander
      .command(subcommand)
      .description(description)
      .action(async () => {
        console.log("test")
        await func(client)
      })
  } catch (err: unknown) {
    console.log(`${chalk.red("Unknown error", err)}`)
  }

  program.parse()
}

main().catch((err: Error) => {
  console.error(`An unexpected error occurred!\n${err.stack}`)
})
