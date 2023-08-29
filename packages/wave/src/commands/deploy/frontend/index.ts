import { execSync } from "child_process";
import { Account } from "@vastly/types";
import ora from "ora";
import chalk from "chalk";
import { Client } from "../../../util/client.js";
import doDeploy from "../../../util/deploy/index.js";
import pkg from "fs-extra";

const { existsSync, readFileSync, readFile, writeFile } = pkg;

export default async function deployFrontend(client: Client, stage: string) {
  const { output } = client;
  let spinner = output.spinner;

  spinner = ora({
    text: chalk.yellow.bold(`Fetching credentials...\n`),
    color: "green",
  });

  try {
    const credentials = await doDeploy(client, "dev");

    if (existsSync("./.env")) {
      const envContents = readFileSync("./.env", "utf8");
      const newEnv = appendNewCredentials(credentials, envContents);
      await writeFile("./.env", newEnv);
    } else {
      await writeFile("./.env", appendNewCredentials(credentials));
    }

    spinner.succeed(
      `${chalk.green(`Temporary credentials written to ${chalk.underline.bold("/.env")}`)}\n`,
    );

    spinner = ora({
      text: chalk.yellow.bold(`Starting deployment...\n`),
      color: "green",
    });
    execSync(`npx sst deploy --stage ${stage}`, { stdio: "inherit" });
  } catch (err: unknown) {
    spinner.fail();
    output.error(err as string);
  }
}

const appendNewCredentials = (credentials: any, input?: string) => {
  const obj: { [key: string]: string } = {};

  if (input?.length) {
    const array = input.split(/\r\n|\n|\r/);
    for (const cred of array) {
      const [key, value] = cred.split("=");
      obj[key] = value;
    }
  }

  // Update AWS credentials in the object
  obj.AWS_ACCESS_KEY_ID = credentials.AccessKeyId;
  obj.AWS_SECRET_ACCESS_KEY = credentials.SecretAccessKey;
  obj.AWS_SESSION_TOKEN = credentials.SessionToken;

  let envFileContents = "";
  for (const key in obj) {
    envFileContents += `${key}=${obj[key]}\n`;
  }
  return envFileContents;
};
