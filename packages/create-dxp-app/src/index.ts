import { Command } from "commander"
import inquirer from "inquirer"
import { generateQuestions } from "./questions/index.js"
import { generateGithubRepo } from "./utils/generateGithubRepo.js"
import { GenerateAnswers } from "../src/types"

const program = new Command()

program
  .description("Custom Offering Core CLI")
  .option("-g, --generate", "Generate new custom offering")
  .parse(process.argv)

const options = program.opts()

if (options.generate) {
  inquirer.prompt(generateQuestions).then((answers: GenerateAnswers) => {
    if (answers.generate) {
      generateGithubRepo(answers)
    }
  })
}
