import { Command } from "commander"
import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm"
// import { spawn, spawnSync, ChildProcess } from "child_process"
import ora from "ora"
import chalk from "chalk"
import { writeFile } from "fs"

const client = new SSMClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: "ASIAW7S7QFIRPXN24HM2",
    secretAccessKey: "xbdXZPpTpq+xJPYCKsfsjb4VeCbGBUO5dZgYKBr0",
    sessionToken:
      "IQoJb3JpZ2luX2VjEG8aCXVzLWVhc3QtMSJHMEUCIBgXZlDnzXoio1bIFI7gLMeKtLKC1R0PaM2gLtxqqUvqAiEA1XGzFZgykKUNiNfB9sTxp5/74FIxxT6BK+eVjYf2+7EqmAMIOBAAGgw0ODAxNjI4ODQxMzAiDE/uVcTcIJ/SVGMZfyr1Ah8cmZT7yWNuCNcEQMcFUau3HEoMsVNMRuWTb8ONIyjEERFI2HNgze3pyCotprwN5p1GA2BehhH9WWCWhDfeQh0MFHrzIkhblBXN+v0zGoUswfved+vNmLZkZYksgkWfv5zvC7ze6YABNriRpaOFFg8zvXyower/Lp5U5hbZRW5LmEzMe33WdNDeuA0LSlCD/u0WU8RiI/6T6FP2GmvDeUxBi6QSCyLq9vKDBITpA9X5w3awWKahGTJMDGLLCjtHOHHR4Yfjh+C8m96CQ6/PZhVnb2lbIDfBYFAYYkeIP57z357ri6ZpkrLTKPifzqLGJ/xG8HlWyTtnOvJCP3UJATUXv6kzvVGbrY3Xd454/yhcO0z128mvlInGHB/LqAIUUYtLgHFWIgV7ynDY6lW6NkWz46aY9In/r39yMR/PHVUulhesLFIyeTbsF+UDbF3c4/zyiycFN4bq5dJNipE1nhaTxFH95E8nkAncNSlcZafRmlw0xG0wx9/ToAY6pgFSb6XGbvDuWw2aQAZyQv97HSp+mjgbHNxm4vORZBW8v456x7I63OtKH0cJt+J3ZtjTBrLOQWXX5rG1KJ4SoCjjWOKNElH+x/OG71mbycaXAJ0N25Zzd6rTIz5hIw0OtkHKXCaLeWBrsuFLTsMDchWgk8rw3oQFTId5CLWmvKpV9+vzN8sDwIaHxOx2sqfkR5mmZAIBBskuPKZpoJK2bNQcgiBYVQad",
  },
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
