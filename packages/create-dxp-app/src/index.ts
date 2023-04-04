import { Command } from "commander"
import inquirer from "inquirer"
import chalk from "chalk"
import { generateQuestions } from "./questions/index.js"
import { generateGithubRepo } from "./utils/generate-github-repo.js"
import { generateLocalRepo } from "./utils/generate-local-repo.js"
import { GenerateAnswers } from "../src/types"

const program = new Command()
program.description("Company.com create-dxp-app").parse(process.argv)

console.log(chalk.yellow.bold(">>> COMPANY.COM dxp"))
console.log(chalk.cyan(">>> Welcome to Company.com! Let's get you set up with a new dxp."))
console.log()

inquirer.prompt(generateQuestions).then((answers: GenerateAnswers) => {
  if (answers.generate && answers.linkToGithub) {
    generateGithubRepo(answers)
  } else if (answers.generate) {
    generateLocalRepo(answers)
  }
})
