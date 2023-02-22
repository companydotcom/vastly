import { Command } from "commander"
import inquirer from "inquirer"
import { loginQuestions, generateQuestions } from "./questions/inquirer.js"

//npx ts-node --esm src/commander/index.tsx --help
const program = new Command()

program
  .description("Custom Offering Core CLI")
  .option("-l, --login", "Login to Company.com CLI")
  .option("-g, --generate", "Generate new custom offering")
  .parse(process.argv)

const options = program.opts()

if (options.login) {
  inquirer.prompt(loginQuestions).then((answers) => {
    console.log(answers)
  })
} else if (options.generate) {
  inquirer.prompt(generateQuestions).then((answers) => {
    console.log(answers)
  })
}
