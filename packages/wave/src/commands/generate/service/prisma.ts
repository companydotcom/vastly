import ora from "ora";
import chalk from "chalk";
import pkg from "fs-extra";
import { execSync, spawn } from "child_process";
import lodashPkg from "lodash";
import * as path from "path";
import { fileURLToPath } from "url";
import { Client } from "../../../util/client.js";

const { existsSync, readFile, writeFile, readJson, writeJson, ensureDir, copy, move } = pkg;
const { kebabCase } = lodashPkg;

export const generatePrismaService = async (
  client: Client,
  name: string,
  description: string,
  deploy: string | undefined,
) => {
  const { output } = client;
  let spinner = output.spinner;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const kebabCaseServiceName = kebabCase(name);
  const frontendTemplate = path.resolve(__dirname, "../../../../dist/templates/frontend", "prisma");
  const backendTemplate = path.resolve(__dirname, "../../../../dist/templates/backend", "prisma");

  try {
    spinner = ora({
      text: chalk.yellow.bold(`Generating ${chalk.underline.cyan(`${kebabCaseServiceName}`)}...\n`),
      color: "yellow",
    }).start();

    if (existsSync("./apps") && existsSync("./apps/client/package.json")) {
      spinner.stopAndPersist();
      try {
        await ensureDir(`./services/${kebabCaseServiceName}`);
        process.chdir(`./services/${kebabCaseServiceName}`);

        const child = spawn("npx", ["create-prisma-appsync-app@latest"], {
          shell: true,
          stdio: ["pipe", "pipe", "pipe"],
        });

        child.stdout.on("data", (data) => {
          const output = data.toString();
          console.log(`stdout: ${output}`);

          if (output.includes("Project directory")) {
            child.stdin.write(`\n`);
          } else if (output.includes("Generate new")) {
            child.stdin.write(`${deploy === "amplify" ? "n" : "y"}\n`);
          } else if (output.includes("Use provided CDK")) {
            child.stdin.write("y\n");
          } else if (output.includes("Create local")) {
            child.stdin.write("y\n");
          }
        });

        child.stderr.on("data", async (data) => {
          console.error(`stderr: ${data}`);
          if (!data) {
            // rename tables to include servicename to make unique
            // From Charlie -- Removing the following 6 lines, because prisma no longer supports camel cased type names
            // const camelCaseServiceName = camelCase(name);
            // const schemaContents = await readFile(`./prisma/schema.prisma`, "utf-8");
            // const modifiedSchemaContents = schemaContents
            //   .replaceAll("User", `${camelCaseServiceName}User`)
            //   .replaceAll("Post", `${camelCaseServiceName}Post`);
            // await writeFile(`./prisma/schema.prisma`, modifiedSchemaContents);
            execSync("npm run generate");

            // .gitignore
            await copy(backendTemplate, `./`);

            // add db and deploy commands, and description to packagejson
            await writeToBackendPackageJson(
              "./package.json",
              description,
              deploy,
              kebabCaseServiceName,
            );
            console.log(
              ` ${chalk.underline.bold.green(
                `${kebabCaseServiceName}`,
              )} files and directory generated!\n`,
            );
            console.log(chalk.magenta("/services"));
            console.log(chalk.magenta(` |- /${kebabCaseServiceName}`));
            console.log(chalk.magenta("   |- /prisma"));
            console.log(chalk.blueBright("   |- cdk.json"));
            console.log(chalk.blueBright("   |- handler.ts"));
            console.log(chalk.blueBright("   |- package.json"));
            console.log(chalk.blueBright("   |- server.ts\n"));

            spinner.succeed(chalk.green(`Successfully generated ${kebabCaseServiceName} service!`));

            process.chdir("../../");
            // if a microservice has already been generated, do not re-copy frontend template, just append new service name into codegen config)
            if (existsSync("./apps/client/graphql") && existsSync("./apps/client/codegen.ts")) {
              // append subsequent service names into codegen config file
              const codegenConfigContents = await readFile("./apps/client/codegen.ts", "utf-8");
              const modifiedCodegenConfigContents = codegenConfigContents.replace(
                /const serviceName = \[(.*?)\];/,
                `const serviceName = [$1, "${kebabCaseServiceName}"];`,
              );
              await writeFile("./apps/client/codegen.ts", modifiedCodegenConfigContents);

              console.log(
                ` ${chalk.underline.bold.green(
                  `${kebabCaseServiceName}`,
                )} files and directory generated!\n`,
              );
              console.log(chalk.magenta("/services"));
              console.log(chalk.magenta(` |- /${kebabCaseServiceName}`));
              console.log(chalk.magenta("   |- /cdk"));
              console.log(chalk.magenta("   |- /prisma"));
              console.log(chalk.blueBright("   |- cdk.json"));
              console.log(chalk.blueBright("   |- handler.ts"));
              console.log(chalk.blueBright("   |- package.json"));
              console.log(chalk.blueBright("   |- server.ts\n"));

              spinner.succeed(
                chalk.green(`Successfully generated ${kebabCaseServiceName} service!`),
              );
              return {
                success: true,
                message: `Successfully generated ${kebabCaseServiceName} service.`,
              };
            } else {
              spinner = ora({
                text: chalk.yellow.bold(
                  `Adding files for ${chalk.underline.cyan(
                    `${kebabCaseServiceName}`,
                  )} to ${chalk.underline.magenta("/client")}...\n`,
                ),
                color: "yellow",
              }).start();

              // copy frontend template
              await copy(frontendTemplate, "./apps/client");

              let innerSpinner = output.spinner;
              innerSpinner = ora({
                text: `Adding Apollo Client Wrapper to ${chalk.cyan("/_app.tsx")}`,
                color: "blue",
                indent: 2,
              }).start();

              // add apollo wrapper around app
              const appContents = await readFile("./apps/client/pages/_app.tsx", "utf-8");
              const modifiedAppContents1 = appContents.replace(
                'import { UiProvider } from "@vastly/ui";',
                "import { UiProvider } from \"@vastly/ui\";\nimport { ApolloWrapper } from '../apollo';",
              );
              const modifiedAppContents2 = modifiedAppContents1.replace(
                /<Component\s*{\.\.\.pageProps}\s*\/>/,
                "<ApolloWrapper>\n        <Component {...pageProps} />\n       </ApolloWrapper>",
              );
              await writeFile("./apps/client/pages/_app.tsx", modifiedAppContents2);
              innerSpinner.succeed();

              //add dependencies and scripts to package.json
              innerSpinner = ora({
                text: `Adding new dependencies to ${chalk.underline.cyan("/client/package.json")}`,
                color: "blue",
                indent: 2,
              }).start();

              console.log(process.cwd());
              await writeToFrontendPackageJson("./apps/client/package.json");
              innerSpinner.succeed();

              // configure codegen config file with first generated microservice gql schema
              innerSpinner = ora({
                text: `Configuring the Codegen config file with ${chalk.underline(
                  `${kebabCaseServiceName}'s`,
                )} GraphQL schema\n`,
                color: "blue",
                indent: 2,
              }).start();

              const codegenConfigContents = await readFile("./apps/client/codegen.ts", "utf-8");
              const modifiedCodegenConfigContents = codegenConfigContents.replace(
                "const serviceName = []",
                `const serviceName = ["${kebabCaseServiceName}"]`,
              );
              await writeFile("./apps/client/codegen.ts", modifiedCodegenConfigContents);

              innerSpinner.succeed();
              console.log("    Files generated:");
              console.log(chalk.magenta("     /client"));
              console.log(chalk.magenta("      |- /graphql"));
              console.log(chalk.blueBright("      |- apollo.tsx"));
              console.log(chalk.blueBright("      |- codegen.ts\n\n"));

              spinner.succeed(
                chalk.green(`Successfully generated ${kebabCaseServiceName} service!`),
              );
              return {
                success: true,
                message: `Successfully generated ${kebabCaseServiceName} service.`,
              };
            }
          } else {
            console.error(data);
          }
        });

        child.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
        });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      spinner.fail("Please use the Vastly CLI from the root of your create-wave-app repo.");
      throw new Error("Please use the Vastly CLI from the root of your create-wave-app repo.");
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: `Something went wrong: ${error}` };
  }
};

const writeToBackendPackageJson = async (
  filePath: string,
  description: string,
  deploy: string | undefined,
  serviceName: string,
) => {
  const backendPackageJson = {
    scripts: {
      db: "npx prisma studio",
      deploy: `${
        deploy === "amplify"
          ? "npx wave deploy amplify"
          : `npx cdk synth && npx cdk bootstrap && npx cdk deploy ${serviceName} --outputs-file ./deploy-outputs.json`
      }`,
    },
  };

  try {
    const packageJson = await readJson(filePath);

    packageJson.scripts = {
      ...packageJson.scripts,
      ...backendPackageJson.scripts,
    };

    packageJson.description = description;

    await writeJson(filePath, packageJson, { spaces: 2 });
  } catch (error) {
    console.error("Error writing scripts and description to package.json:", error);
  }
};

const writeToFrontendPackageJson = async (filePath: string) => {
  const frontendPackageJson = {
    dependencies: {
      "@apollo/client": "^3.7.14",
      "@graphql-codegen/typescript-operations": "^4.0.0",
      "@graphql-codegen/typescript-react-apollo": "^3.3.7",
      "@graphql-codegen/typescript-resolvers": "^3.2.1",
      "aws-appsync-auth-link": "^3.0.7",
      "aws-appsync-subscription-link": "^3.1.2",
      graphql: "^16.6.0",
      "@graphql-codegen/cli": "^3.3.1",
      uuid: "9.0.0",
    },
  };

  try {
    const packageJson = await readJson(filePath);

    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...frontendPackageJson.dependencies,
    };

    await writeJson(filePath, packageJson, { spaces: 2 });
  } catch (error) {
    console.error("Error writing to package.json:", error);
  }
};
