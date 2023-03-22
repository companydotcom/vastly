import { Command } from "commander"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import ora from "ora"
import chalk from "chalk"
import { writeFile } from "fs"

const client = new S3Client({
  region: "us-east-1",
})

const program = new Command()

program
  .description(
    "Custom Offering Variables Manager (nonsensitive data). For sensitive data, please use ('pnpm run secrets-pull)'",
  )
  .requiredOption("-p, --pull <env>", "Must specify an environment. For example: prod or dev")
  .option("-l, --list", "List all environment variables")
  .parse(process.argv)

const options = program.opts()
const env = options.pull

if (options.list) {
  console.log(chalk.bgCyanBright(`Nothing to list! Come back soon :)`))
} else {
  const getVariables = async () => {
    const spinner = ora({
      text: `Pulling variables...`,
      color: "magenta",
    }).start()
    try {
      const initialCommand = new GetObjectCommand({
        Bucket: "testdxp-variables",
        Key: `${env}/env.txt`,
      })

      const { Body, $metadata } = await client.send(initialCommand)
      const responseToString = await Body.transformToString()

      if ($metadata.httpStatusCode === 200) {
        spinner.succeed(chalk.green(`Variables for ${env} successfully fetched`))

        const createFileSpinner = ora({
          text: "Creating .env file...",
          color: "magenta",
        }).start()
        writeFile(`./.env`, responseToString, (err) => {
          if (err) throw new Error()
        })
        createFileSpinner.succeed(chalk.bgGreenBright(`File successfully created!`))
      } else {
        throw new Error(
          chalk.red(
            `There are no variables stored for the ${env}. Use "--help" to see available options`,
          ),
        )
      }
    } catch (error) {
      spinner.stop()
      if (error.Code === "NoSuchKey") {
        console.log(
          chalk.bgRedBright(
            `${error.Code}: There are no variables stored for this environment. Use "--help" to see available options`,
          ),
        )
      }
      if (error.Code === "ExpiredToken") {
        console.log(
          chalk.bgYellowBright(
            `${error.Code}: Your token has expired. Please refresh your credentials.`,
          ),
        )
      }
    }
  }
  getVariables()
}

/**
 * TODO:
 * Proper error handling, authentication, .env file placement, add/delete
 */
