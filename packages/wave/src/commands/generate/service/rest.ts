import ora from "ora";
import chalk from "chalk";
import * as path from "path";
import { fileURLToPath } from "url";
import pkg from "fs-extra";
import { Client } from "../../../util/client.js";

const { copy, existsSync, ensureDir, readJson, writeJson, readFile, writeFile, move } = pkg;

export const generateRestService = async (client: Client, name: string, description: string) => {
  const { output } = client;
  let spinner = output.spinner;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const serviceName = name.toLowerCase().replace(/\s+/g, "-");

  try {
    spinner = ora({
      text: chalk.yellow.bold(`Generating ${chalk.underline.cyan(`${serviceName}`)}...\n`),
      color: "yellow",
    }).start();

    const backendTemplate = path.resolve(__dirname, "../../../../dist/templates/backend", "rest");
    const frontendTemplate = path.resolve(__dirname, "../../../../dist/templates/frontend", "rest");
    if (existsSync("./apps") && existsSync("./apps/client/package.json")) {
      spinner.stopAndPersist();
      // backend
      await ensureDir(`./services/${serviceName}`);
      await copy(backendTemplate, `./services/${serviceName}`);
      await move(`./services/${serviceName}/_gitignore`, `./services/${serviceName}/.gitignore`);

      // write service name and description to package.json
      const templateContents = await readFile(`./services/${serviceName}/package.json`, "utf-8");
      const modifiedTemplateContents = templateContents
        // @ts-ignore -- replaceAll
        .replaceAll("<%= appName %>", serviceName)
        .replace("<%= description %>", description);
      await writeFile(`./services/${serviceName}/package.json`, modifiedTemplateContents);

      // write service name to cdk file
      const cdkContents = await readFile(`./services/${serviceName}/cdk/src/index.ts`, "utf-8");
      const modifiedCdkContents = cdkContents.replace("Service Name", serviceName);
      await writeFile(`./services/${serviceName}/cdk/src/index.ts`, modifiedCdkContents);

      // if a microservice has already been generated, do not re-copy frontend template, just append new service name into codegen config)
      if (existsSync("./apps/client/graphql") && existsSync("./apps/client/codegen.ts")) {
        // append subsequent service names into codegen config file
        const codegenConfigContents = await readFile("./apps/client/codegen.ts", "utf-8");
        const modifiedCodegenConfigContents = codegenConfigContents.replace(
          /const serviceName = \[(.*?)\];/,
          `const serviceName = [$1, "${serviceName}"];`,
        );
        await writeFile("./apps/client/codegen.ts", modifiedCodegenConfigContents);

        console.log(
          ` ${chalk.underline.bold.green(`${serviceName}`)} files and directory generated!\n`,
        );
        console.log(chalk.magenta("/services"));
        console.log(chalk.magenta(` |- /${serviceName}`));
        console.log(chalk.magenta("   |- /cdk"));
        console.log(chalk.magenta("   |- /prisma"));
        console.log(chalk.blueBright("   |- cdk.json"));
        console.log(chalk.blueBright("   |- handler.ts"));
        console.log(chalk.blueBright("   |- package.json"));
        console.log(chalk.blueBright("   |- server.ts\n"));

        spinner.succeed(chalk.green(`Successfully generated ${serviceName} service!`));
        return { success: true, message: `Successfully generated ${serviceName} service.` };
      } else {
        console.log(
          ` ${chalk.underline.bold.green(`${serviceName}`)} files and directory generated!\n`,
        );
        console.log(chalk.magenta("/services"));
        console.log(chalk.magenta(` |- /${serviceName}`));
        console.log(chalk.magenta("   |- /cdk"));
        console.log(chalk.magenta("   |- /prisma"));
        console.log(chalk.blueBright("   |- cdk.json"));
        console.log(chalk.blueBright("   |- handler.ts"));
        console.log(chalk.blueBright("   |- package.json"));
        console.log(chalk.blueBright("   |- server.ts\n"));

        spinner = ora({
          text: chalk.yellow.bold(
            `Adding files for ${chalk.underline.cyan(
              `${serviceName}`,
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

        await writeToPackageJson("./apps/client/package.json");
        innerSpinner.succeed();

        // configure codegen config file with first generated microservice gql schema
        innerSpinner = ora({
          text: `Configuring the Codegen config file with ${chalk.underline(
            `${serviceName}'s`,
          )} GraphQL schema\n`,
          color: "blue",
          indent: 2,
        }).start();

        const codegenConfigContents = await readFile("./apps/client/codegen.ts", "utf-8");
        const modifiedCodegenConfigContents = codegenConfigContents.replace(
          "const serviceName = []",
          `const serviceName = ["${serviceName}"]`,
        );
        await writeFile("./apps/client/codegen.ts", modifiedCodegenConfigContents);

        innerSpinner.succeed();
        console.log("    Files generated:");
        console.log(chalk.magenta("     /client"));
        console.log(chalk.magenta("      |- /graphql"));
        console.log(chalk.blueBright("      |- apollo.tsx"));
        console.log(chalk.blueBright("      |- codegen.ts\n\n"));

        spinner.succeed(chalk.green(`Successfully generated ${serviceName} service!`));
        return { success: true, message: `Successfully generated ${serviceName} service.` };
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

const writeToPackageJson = async (filePath: string) => {
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
