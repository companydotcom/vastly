import { Command } from "commander"
import {
  CreateSecretCommand,
  GetSecretValueCommand,
  ListSecretsCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
  UpdateSecretCommand,
} from "@aws-sdk/client-secrets-manager"
import ora from "ora"
import chalk from "chalk"
import { writeFile } from "fs"

const client = new SecretsManagerClient({
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
  const command = new ListSecretsCommand({
    Filters: [
      { Key: "tag-key", Values: ["environment"] },
      { Key: "tag-value", Values: [`${options.list}`] },
    ],
  })
  const listSecrets = async () => {
    const { SecretList } = await client.send(command)
    console.log("🚀 ~ file: index.ts:32 ~ listSecrets ~ response:", SecretList)
    const secretNamesFromList = SecretList.map((secret) => secret.Name)
    console.log(
      "🚀 ~ file: index.ts:39 ~ listSecrets ~ secretNamesFromList:",
      secretNamesFromList.join(),
    )

    const getAllEnvSecrets = new GetSecretValueCommand({
      SecretId: secretNamesFromList.join(", "),
    })
    const response = await client.send(getAllEnvSecrets)
    console.log("🚀 ~ file: index.ts:45 ~ listSecrets ~ response:", response)
    console.log(chalk.bgCyanBright(`Nothing to list! Come back soon :)`))
  }
  listSecrets()
}
if (options.add) {
  const addVariableToSM = async () => {
    try {
      const spinner = ora({
        text: `Creating env store...`,
        color: "magenta",
      }).start()

      const createSecret = new CreateSecretCommand({
        Description: "My test database secret created with the CLI",
        Name: "MyTestDatabaseSecret2",
        SecretString:
          '{"username":"SierraTryingToAddToExisting","password":"EXAMPLE-PASSWORD-TESTING-UPDATE"}',
        Tags: [{ Key: "environment", Value: `${options.add}` }],
      })
      const response = await client.send(createSecret)
      console.log("🚀 ~ file: index-s3.ts:65 ~ addVariableToS3 ~ response:", response)

      spinner.stop()
    } catch (error) {
      console.log("🚀 ~ file: index-s3.ts:97 ~ addVariableToS3 ~ error:", error)
    }
  }
  addVariableToSM()
}

if (options.pull) {
  const getVariables = async () => {
    const env = options.pull
    const spinner = ora({
      text: `Pulling variables...`,
      color: "magenta",
    }).start()

    try {
      const initialCommand = new GetSecretValueCommand({
        SecretId: "MyTestDatabaseSecret2",
      })

      const { SecretString, $metadata } = await client.send(initialCommand)
      console.log("🚀 ~ file: index.ts:93 ~ getVariables ~ SecretString:", SecretString)

      if ($metadata.httpStatusCode === 200) {
        spinner.succeed(chalk.green(`Variables for ${env} successfully fetched`))

        const createFileSpinner = ora({
          text: "Creating .env file...",
          color: "magenta",
        }).start()
        writeFile(`./.env`, SecretString, (err) => {
          if (err) throw new Error()
        })
        createFileSpinner.succeed(chalk.bgGreenBright(`File successfully created!`))
      } else {
        throw new Error()
      }
      spinner.stop()
    } catch (error) {
      console.log("🚀 ~ file: index-s3.ts:127 ~ getVariables ~ error:", error)
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
      if (error.Code === "NoSuchBucket") {
        console.log(
          chalk.bgYellowBright(
            `${error.Code}: You haven't created a environment store! Run 'pnpm run env --add <env>' to set up your store`,
          ),
        )
      }
    }
  }
  getVariables()
}

// if (options.delete) {
//   // cannot append or edit an existing file in s3
//   // pull down data and store locally/copy it
//   // using user input to get a key, delete the necessary line
//   // use PutObject command to overwrite existing file in s3
//   const deleteVariable = async () => {
//     const env = options.delete
//     const initialCommand = new GetObjectCommand({
//       Bucket: "dxp-uniquevalue-envs",
//       Key: `${env}.txt`,
//     })

//     const { Body, $metadata } = await client.send(initialCommand)
//     const responseToString = await (await Body.transformToString()).split("=")
//     console.log("🚀 ~ file: index-s3.ts:161 ~ deleteVariable ~ responseToString:", responseToString)
//   }
//   deleteVariable()
// }
/**
 * TODO:
 * Proper error handling, authentication, .env file placement, add/delete will need prompts like key/value to add & key to delete
 */

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
