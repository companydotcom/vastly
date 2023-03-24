import { Command } from "commander"
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  // ListBucketsCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3"
import ora from "ora"
import chalk from "chalk"
import inquirer from "inquirer"
import { writeFile } from "fs"

const client = new S3Client({
  region: "us-east-1",
})

const program = new Command()

program
  .description("Environment variables manager")
  .option("-p, --pull <env>", "Must specify an environment. For example: prod or dev")
  .option("-l, --list <env>", "List all environment variables")
  .option("-a, --add <env>", "Add a value to a specific environment")
  .option("-d, --delete <env>", "Remove a value to a specific environment")
  .parse(process.argv)

const options = program.opts()

if (options.list) {
  const listObjects = async () => {
    try {
      const listBuckets = new ListObjectsV2Command({
        Bucket: "dxp-uniquevalue-envs",
      })
      const response = await client.send(listBuckets)
      if (response.Contents.length) {
        console.log("🚀 ~ file: index-s3.ts:38 ~ listObjects ~ Contents:", response)
      } else {
        console.log(chalk.bgCyanBright(`Nothing to list! Come back soon :)`))
      }
    } catch (error) {
      errorHandling(error.Code)
    }
  }
  listObjects()
}
if (options.add) {
  const addVariableToS3 = async () => {
    // cannot append to an existing file in s3
    // pull down file from s3 aka check it's existence
    // if exists
    // copy contents locally and add the key/value pair obtained by CLI prompts
    // use PutObject to overwrite existing file
    // if not
    // use PutObject to create new file
    try {
      // check is envs bucket exists already
      // if so,
      // copy current object
      // create new object: Ask for key/value from CLI
      // combine both old and new and submit
      const spinner = ora({
        text: `Creating env store...`,
        color: "magenta",
      }).start()
      // if bucket already exists, nothing happens ??
      const createBucket = new CreateBucketCommand({
        Bucket: "dxp-uniquevalue-envs",
        ObjectOwnership: "BucketOwnerEnforced",
      })
      const { Location } = await client.send(createBucket)
      if (Location) {
        spinner.succeed(chalk.green(`Store successfully created!`))

        const createObjSpinner = ora({
          text: "Storing your variables...",
          color: "magenta",
        }).start()

        const createEnvObj = new PutObjectCommand({
          Body: `${options.add}=ThisIsATest`,
          Bucket: "dxp-uniquevalue-envs",
          Key: `${options.add}.txt`,
          ServerSideEncryption: "AES256",
          Tagging: `environment=${options.add}`,
        })
        const { ETag } = await client.send(createEnvObj)
        if (ETag)
          createObjSpinner.succeed(chalk.bgGreenBright(`Success! Your data has been stored.`))
      }
      spinner.stop()
    } catch (error) {
      errorHandling(error.Code)
    }
  }
  addVariableToS3()
}

if (options.pull) {
  const getVariables = async () => {
    const env = options.pull
    const spinner = ora({
      text: `Pulling variables...`,
      color: "magenta",
    }).start()

    try {
      const initialCommand = new GetObjectCommand({
        Bucket: "dxp-uniquevalue-envs",
        Key: `${env}.txt`,
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
        throw new Error()
      }
    } catch (error) {
      console.log("🚀 ~ file: index-s3.ts:127 ~ getVariables ~ error:", error)
      spinner.stop()
      errorHandling(error.Code)
    }
  }
  getVariables()
}

if (options.delete) {
  // cannot append or edit an existing file in s3
  // pull down data and store locally/copy it
  // using user input to get a key, delete the necessary line
  // use PutObject command to overwrite existing file in s3
  const deleteVariable = async () => {
    const env = options.delete
    try {
      const initialCommand = new GetObjectCommand({
        Bucket: "dxp-uniquevalue-envs",
        Key: `${env}.txt`,
      })

      const { Body, $metadata } = await client.send(initialCommand)
      const responseToString = await (await Body.transformToString()).split("=")
      console.log(
        "🚀 ~ file: index-s3.ts:161 ~ deleteVariable ~ responseToString:",
        responseToString,
      )
    } catch (error) {
      errorHandling(error.Code)
    }
  }
  deleteVariable()
}
/**
 * TODO:
 * Proper error handling, authentication, .env file placement, add/delete will need prompts like key/value to add & key to delete
 */

const convertToEnv = (allParams: any) => {
  let envFile = ""
  const result = {}
  for (const key of Object.keys(result)) {
    envFile += `${key}=${result[key]}\n`
  }
  return envFile
}

const errorHandling = (errorCode: string) => {
  console.log("🚀 ~ file: index-s3.ts:178 ~ errorHandling ~ errorCode:", errorCode)
  if (errorCode === "NoSuchKey") {
    console.log(
      chalk.bgYellowBright(
        `${errorCode}: There are no variables stored for this environment. Use "--help" to see available options`,
      ),
    )
  }
  if (errorCode === "ExpiredToken") {
    console.log(
      chalk.bgYellowBright(
        `${errorCode}: Your token has expired. Please refresh your credentials.`,
      ),
    )
  }
  if (errorCode === "NoSuchBucket") {
    console.log(
      chalk.bgYellowBright(
        `${errorCode}: You haven't created a environment store! Run 'pnpm run env --add <env>' to set up your store`,
      ),
    )
  }
}
