import { Command } from "commander"
import inquirer from "inquirer"
import { loginQuestions, generateQuestions } from "./questions/inquirer.js"
import { spawn, ChildProcess } from "child_process"

//npx ts-node --esm src/index.tsx --help
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
    if (answers.generate) {
      const runCommand = (command: string, args: string[]): Promise<void> => {
        const child: ChildProcess = spawn(command, args, { stdio: "inherit" })
        return new Promise<void>((resolve, reject) => {
          child.on("exit", (code: number) => {
            if (code !== 0) {
              reject(new Error(`Command failed with exit code ${code}`))
            } else {
              resolve()
            }
          })
        })
      }

      const main = async (): Promise<void> => {
        try {
          await runCommand("yo", ["@companydotcom/dxp-app"])
          console.log("Command completed successfully")
        } catch (error) {
          console.error(error)
        }
      }

      main()
    }
  })
}
