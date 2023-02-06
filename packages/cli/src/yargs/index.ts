import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import prompts from "prompts"
import enquirer from "enquirer"
import chalk from "chalk"
import ora from "ora"
import { loginQuestions, generateQuestions } from "./questions/prompts.js"
import { enquirerQuestions } from "./questions/enquirer.js"

const options = yargs(hideBin(process.argv)).options({
  l: { alias: "login", describe: "Login to Company.com CLI" },
  g: { alias: "generate", describe: "Generate new custom offering" },
  env: { choices: ["prompts", "enquirer"], demandOption: true },
}).argv

// PROMPTS
// navigate to cli, run "npx ts-node --esm src/yargs/index.ts --help"
if (options.env === "prompts") {
  if (options.login) {
    ;(async () => {
      await prompts(loginQuestions)
      const spinner = ora("Logging into Company.com CLI").start()
      setTimeout(() => {
        spinner.color = "yellow"
        spinner.text = chalk.yellowBright("Successfully logged into Company.com CLI with prompts")
        spinner.succeed()
      }, 5000)
    })()
  }
  if (options.generate === true) {
    ;(async () => {
      const response = await prompts(generateQuestions)
      console.log(response)
      const spinner = ora("Generating custom offering").start()
      setTimeout(() => {
        spinner.color = "cyan"
        spinner.text = chalk.yellowBright(
          "Custom offering generation successful please navigate to the dxp directory to begin developing your custom offering",
        )
        spinner.succeed()
      }, 5000)
    })()
  }

  // ENQUIRER - DOES NOT WORK WITH ESM
} else if (options.generate === "enquirer") {
  if (options.login) {
    console.log(chalk.yellowBright("Login with Enquirer successful"))
  }
  if (options.generate) {
    ;(async () => {
      const response = await enquirer.prompt(enquirerQuestions)
      console.log(chalk.blue.bgGreen("enquirer responses", JSON.stringify(response)))
      const spinner = ora(`Loading ${chalk.red("unicorns")}`).start()
      setTimeout(() => {
        spinner.color = "yellow"
        spinner.text = `Loading unicorns ${chalk.green("success")}`
        spinner.succeed()
      }, 5000)
    })()
  }
}
