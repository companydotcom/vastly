#! /usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"

const main = async () => {
  const program = new Command()

  program.name("dxp").description("CLI for company.com").version("0.0.1")

  // Top level command for the CLI
  const client = program.command("dxp")

  program.parse(process.argv)

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
        func = require("./commands/login").default
        break
      case "logout":
        description = "Log out of company.com"
        func = require("./commands/logout").default
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

    client
      .command(subcommand)
      .description(description)
      .action(async () => {
        await func(client)
      })
  } catch (err: unknown) {
    console.log(`${chalk.red("Unknown error")}`)
  }

  program.parse()
}

main().catch((err: Error) => {
  console.error(`An unexpected error occurred!\n${err.stack}`)
})
