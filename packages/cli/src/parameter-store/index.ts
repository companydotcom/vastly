import { Command } from "commander"
import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm"
import ora from "ora"
import chalk from "chalk"
import { writeFile } from "fs"

const client = new SSMClient({
  region: "us-east-1",
})

const program = new Command()

program
  .description("Environment variables manager")
  .option("-p, --pull <env>", "Must specify an environment. For example: prod or dev")
  .option("-l, --list <env>", "List all environment variables")
  .option("-a, --add <env>", "Add a value to a specific environment")
  .option("-d, --delete <env> <key>", "Remove a value to a specific environment")
  .parse(process.argv)

const options = program.opts()

if (options.list) {
  console.log("oh fuh")
} else {
  const getParams = async () => {
    try {
      const spinner = ora({
        text: `Pulling all dev variables...`,
        color: "magenta",
      }).start()
      const initialCommand = new GetParametersByPathCommand({
        Path: `/dxp/env/dev`,
        WithDecryption: true,
      })

      const { Parameters } = await client.send(initialCommand)
      console.log("🚀 ~ file: index.ts:38 ~ getParams ~ Parameters:", Parameters)
      if (Parameters.length) {
        spinner.succeed(chalk.green(`Variables for dev successfully fetched`))

        const createFileSpinner = ora({
          text: "Creating .env file...",
          color: "magenta",
        }).start()
        writeFile(`./.env`, convertToEnv(Parameters), (err) => {
          if (err) throw new Error()
        })
        createFileSpinner.succeed(chalk.green(`File successfully created!`))
      } else {
        throw new Error()
      }
    } catch (error) {
      console.log("UH OH: ", error)
    }
  }
  getParams()
}

const convertToEnv = (allParams: any) => {
  let envFile = ""
  const result = {}
  allParams.map((parameter: any) => {
    if (parameter.Name.includes("region")) {
      result["AWS_REGION"] = parameter.Value
    }
  })
  for (const key of Object.keys(result)) {
    envFile += `${key}=${result[key]}\n`
  }
  return envFile
}

/**
 * TODO:
 * Proper error handling, authentication, .env file placement
 */
