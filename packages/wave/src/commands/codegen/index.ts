import ora from "ora";
import chalk from "chalk";
import pkg from "fs-extra";
import { Client } from "../../util/client.js";
import { execSync } from "child_process";
const { existsSync, readFile } = pkg;

export default async function codegen(client: Client) {
  const { output } = client;
  let spinner = output.spinner;

  try {
    spinner = ora({
      text: chalk.yellow.bold(`Generating GraphQL Types and Hooks...\n`),
      color: "yellow",
    }).start();

    // checks if service has been generated
    if (existsSync("./graphql") && existsSync("./codegen.ts")) {
      // checks if apollo client has been configured
      if (await isApolloConfigured(client)) {
        execSync("graphql-codegen --config codegen.ts", { stdio: "inherit" });

        spinner.succeed(chalk.yellow.bold(`Generated GraphQL Types and Hooks\n`));
        console.log(" File generated:");
        console.log(chalk.magenta("  /client"));
        console.log(chalk.magenta("    |- /graphql"));
        console.log(chalk.blueBright("       |- graphql-types.ts"));
        console.log();
        console.log(`${chalk.underline.yellow("Next steps:")}`);
        console.log(
          `- Inside the ${chalk.underline.blueBright(
            "graphql-types.ts",
          )} file, you'll find all your generated types plus hooks for use in your front-end applications.\n Scroll to the bottom of the file for further instructions on their usage!\n`,
        );
      } else {
        spinner.fail(
          `Make sure your Apollo Client is configured correctly! --> ${chalk.underline.cyan(
            "apollo.tsx\n",
          )}`,
        );
        throw new Error("Command failed with exit code 1");
      }
    } else {
      spinner.fail(
        `No microservice(s) detected!\n Run ${chalk.bold.italic.yellow(
          "wave generate service",
        )} to get started\n`,
      );
      throw new Error("Command failed with exit code 1");
    }
  } catch (err: unknown) {
    output.error(err as string);
  }
}

// Checks if apollo.tsx is configured
const isApolloConfigured = async (client: Client) => {
  const { output } = client;
  const regex = /[url, region, apiKey]\s[=, :]\s"";/;

  try {
    const apolloContents = await readFile("./apollo.tsx", "utf-8");
    if (apolloContents.match(regex)) {
      return false;
    }
    return true;
  } catch (err) {
    output.error(err as string);
  }
};
