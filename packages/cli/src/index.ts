import { Command } from "commander"
import inquirer from "inquirer"
import { loginQuestions } from "./questions/index.js"

const program = new Command()

program
  .description("Custom Offering Core CLI")
  .option("-l, --login", "Login to Company.com CLI")
  .parse(process.argv)

const options = program.opts()

if (options.login) {
  inquirer.prompt(loginQuestions).then((answers: loginAnswers) => {
    console.log(answers)
  })
}

interface loginAnswers {
  username: string
  password: string
}
