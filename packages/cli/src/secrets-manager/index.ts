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
  .description("Custom Offering Secrets Manager")
  .option("-env, --environment <env>", "Environment", "dev")
  .option("-l, --list", "List all environment variables")
  .option("--with-decryption", "Decrypt encrypted values")
  .parse(process.argv)

const options = program.opts()
const env = options.environment ? options.environment : "dev"

if (options.list) {
  console.log("oh fuh")
} else {
  const getParams = async () => {
    try {
      const spinner = ora({
        text: `Pulling all ${env} variables...`,
        color: "magenta",
      }).start()
      const initialCommand = new GetParametersByPathCommand({
        Path: `/dxp/env/${options.environment}`,
        WithDecryption: options.withDecryption,
      })

      const { Parameters } = await client.send(initialCommand)
      if (Parameters.length) {
        spinner.succeed(chalk.green(`Variables for ${env} successfully fetched`))

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
