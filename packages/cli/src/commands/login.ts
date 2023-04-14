import ora, { Ora } from "ora"
import chalk from "chalk"
import inquirer from "inquirer"
import { Client } from "../util/client.js"
import doEmailLogin from "../util/login/email.js"

export default async function login(client: Client) {
  const { output } = client

  try {
    let spinner: Ora

    const email: string = await inquirer
      .prompt([
        {
          type: "text",
          name: "email",
          message: "What is your email address?",
        },
      ])
      .then((a) => a.email)
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          throw new Error("Interactive mode not supported")
        } else {
          // Something else went wrong
          output.error("something wrong")
        }
      })

    const test = await doEmailLogin(client, email)

    spinner = ora({
      text: "Sending you an email...\n",
      color: "yellow",
    }).start()

    spinner.succeed(chalk.green("logged in successfully"))
  } catch (err: unknown) {
    output.error(err as string)
  }
}
