import ora from "ora";
import chalk from "chalk";
import pkg from "fs-extra";
import lodashPkg from "lodash";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import path from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { print } from "graphql";
import { Client } from "../../../util/client.js";

const { existsSync, writeJson, writeFileSync, removeSync } = pkg;
const { camelCase } = lodashPkg;

export const deployAmplify = async (client: Client) => {
  const { output } = client;
  let spinner = output.spinner;
  const repoName = camelCase(path.basename(path.dirname(process.cwd())));

  // if first deployment, amplify init and add api
  if (path.basename(process.cwd()) === "services" && !existsSync("./amplify")) {
    // amplify init
    try {
      spinner = ora({
        text: chalk.yellow.bold(`Initializing Amplify`),
        color: "yellow",
      }).start();
      execSync("amplify init --yes");
      console.log("\nAmplify files and directory generated!\n");
      console.log(chalk.magenta("/services"));
      console.log(chalk.magenta(" |- /amplify"));
      console.log(chalk.magenta("  |- /.config"));
      console.log(chalk.magenta("  |- /#current-cloud-backend"));
      console.log(chalk.magenta("  |- /backend"));
      console.log(chalk.magenta("  |- /hooks"));
      console.log(chalk.blueBright("  |- cli.json"));
      console.log(chalk.blueBright("  |- README.md"));
      console.log(chalk.blueBright("  |- team-provider-info.json"));
      console.log(chalk.magenta(" |- /src"));
      console.log(chalk.magenta("  |- aws-exports.js"));
      console.log(chalk.blueBright(" |- .gitignore\n"));
      spinner.succeed(chalk.green.bold("✅ Amplify successfully initialized\n"));

      // amplify add api
      spinner = ora({
        text: chalk.yellow.bold(`Adding GraphQL AppSync API`),
        color: "yellow",
      }).start();

      const typesArray = loadFilesSync(path.join("./", "."), {
        extensions: ["gql"],
        recursive: true,
      });
      const mergedSchema = mergeTypeDefs(typesArray);
      const printedTypeDefs = print(mergedSchema);
      writeFileSync("./joined.graphql", printedTypeDefs);
      const schema = readFileSync(path.resolve("joined.graphql"), "utf8");
      const apiConfig = {
        version: 1,
        serviceConfiguration: {
          serviceName: "AppSync",
          apiName: `${repoName}Services`, // must be alphanumeric
          transformSchema: schema,
          defaultAuthType: {
            mode: "API_KEY",
          },
        },
      };
      await writeJson("./newHeadlessApi.addapi.json", apiConfig, "utf-8");
      execSync("cat newHeadlessApi.addapi.json | jq -c | amplify add api --headless");

      console.log("\nAmplify files and directory generated!\n");
      console.log(chalk.magenta("/amplify"));
      console.log(chalk.magenta(" |- /backend"));
      console.log(chalk.magenta("  |- /api"));
      console.log(chalk.magenta(`   |- /${repoName}Services`));
      console.log(chalk.magenta("  |- /awscloudformation"));
      console.log(chalk.magenta("  |- /types"));
      console.log(chalk.blueBright("  |- amplify-meta.json"));
      console.log(chalk.blueBright("  |- backend-config.json"));
      console.log(chalk.blueBright("  |- tags.json\n"));
      spinner.succeed(
        chalk.green.bold("✅ Successfully added GraphQL AppSync API resource locally\n"),
      );
      removeSync("./joined.graphql");

      // amplify push (deploy)
      spinner = ora({
        text: chalk.yellow.bold(`Deploying AppSync API to AWS. This may take a few minutes`),
        color: "yellow",
      }).start();
      execSync("amplify push --yes");
      spinner.succeed(chalk.green.bold("✅ GraphQL AppSync API successfully deployed!"));
    } catch (error) {
      console.error("Error:", error);
      spinner.fail(chalk.bgMagentaBright("  There was an error deploying your AppSync API  \n"));
      throw new Error(`Command failed with exit code 1. Error: ${error}`);
    }
    //if subsequent deployment, update schema, amplify push
  } else if (
    existsSync("./amplify/backend/api") &&
    existsSync("./src/graphql") &&
    existsSync("./newHeadlessApi.addapi.json")
  ) {
    const typesArray = loadFilesSync(path.join("./", "."), {
      extensions: ["gql"],
      recursive: true,
    });
    const mergedSchema = mergeTypeDefs(typesArray);
    const printedTypeDefs = print(mergedSchema);
    writeFileSync(`./amplify/backend/api/${repoName}Services/schema.graphql`, printedTypeDefs);
    try {
      spinner = ora({
        text: chalk.yellow.bold(
          `Deploying changes to your AWS AppSync API. This may take a few minutes`,
        ),
        color: "yellow",
      }).start();
      execSync("amplify push --yes");
      spinner.succeed(chalk.green.bold("GraphQL AppSync API changes successfully deployed"));
    } catch (error) {
      console.error("Error:", error);
      spinner.fail(chalk.bgMagentaBright("  There was an error deploying your AppSync API  \n"));
      throw new Error(`Command failed with exit code 1. Error: ${error}`);
    }
  } else if (path.basename(process.cwd()) !== "services") {
    throw new Error(
      `Command failed with exit code 1. Error: Please navigate to the root of your services directory in your create-wave-app to use this command.`,
    );
  }
};
