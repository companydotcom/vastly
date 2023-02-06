import { Command } from "commander"
import inquirer from "inquirer"
import { loginQuestions, generateQuestions } from "./questions/inquirer.js"
import { render, Text } from "ink"
import React from "react"

// Example of ink - may be overkill for our needs
const Example = () => (
  <>
    <Text color="green">I am green</Text>
    <Text color="black" backgroundColor="white">
      I am black on white
    </Text>
    <Text color="#ffffff">I am white</Text>
    <Text bold>I am bold</Text>
    <Text italic>I am italic</Text>
    <Text underline>I am underline</Text>
    <Text strikethrough>I am strikethrough</Text>
    <Text inverse>I am inversed</Text>
  </>
)

render(<Example />)

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
