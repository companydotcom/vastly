import ora, { Ora } from "ora"
import chalk from "chalk"
import inquirer from "inquirer"
import { Client } from "../util/client"

export default async function login(client: Client) {
  const { output } = client

  try {
    let spinner: Ora

    inquirer
      .prompt([
        {
          type: "text",
          name: "emailaddress",
          message: "What is your email address?",
        },
      ])
      .then((answers) => {
        spinner = ora({
          text: "Sending you an email...\n",
          color: "yellow",
        }).start()

        console.log("👾 ~ .then ~ answers:", answers)

        spinner.succeed(chalk.green("logged in successfully"))
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      })

    output.debug("DEBUG WORKS")
  } catch (err: unknown) {}

  //
  // result = await doEmailLogin()
  //
  // check if email login failed, return result
  //
  // Save the user's authentication token to the configuration file.
  // https://vercel.com/docs/concepts/projects/project-configuration/global-configuration
}
