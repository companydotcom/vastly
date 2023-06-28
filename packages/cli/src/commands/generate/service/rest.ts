import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pkg from "fs-extra";
import { Client } from "../../../util/client.js";

const { copy, existsSync, ensureDir, readJson, writeJson, readFile, writeFile, move } = pkg;

export const generateRestService = async (client: Client, name: string, description: string) => {
  const { output } = client;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const serviceName = name.toLowerCase().replace(/\s+/g, "-");

  try {
    const backendTemplate = path.resolve(__dirname, "../../../../dist/templates/backend", "rest");
    const frontendTemplate = path.resolve(__dirname, "../../../../dist/templates/frontend", "rest");
    if (
      existsSync("./services") &&
      existsSync("./apps") &&
      existsSync("./apps/client/package.json")
    ) {
      // backend
      await ensureDir(`./services/${serviceName}`);
      await copy(backendTemplate, `./services/${serviceName}`);

      // write service name and description to package.json
      const templateContents = await readFile(`./services/${serviceName}/package.json`, "utf-8");
      const modifiedTemplateContents = templateContents
        .replace("<%= appName %>", serviceName)
        .replace("<%= description %>", description);
      await writeFile(`./services/${serviceName}/package.json`, modifiedTemplateContents);

      // write service name to cdk file
      const cdkContents = await readFile(`./services/${serviceName}/cdk/src/index.ts`, "utf-8");
      const modifiedCdkContents = cdkContents.replace("Service Name", serviceName);
      await writeFile(`./services/${serviceName}/cdk/src/index.ts`, modifiedCdkContents);

      // if a microservice has already been generated, do not re-copy frontend template, just append new service name into codgen config)
      if (existsSync("./apps/client/graphql") && existsSync("./apps/client/codegen.ts")) {
        // append subsequent service names into codegen config file
        const codegenConfigContents = await readFile("./apps/client/codegen.ts", "utf-8");
        const modifiedCodegenConfigContents = codegenConfigContents.replace(
          /const serviceName = \[(.*?)\];/,
          `const serviceName = [$1, "${serviceName}"];`,
        );
        await writeFile("./apps/client/codegen.ts", modifiedCodegenConfigContents);

        return { success: true, message: `Successfully generated ${serviceName} service.` };
      } else {
        // copy frontend template
        await copy(frontendTemplate, "./apps/client");

        // add apollo wrapper around app
        const appContents = await readFile("./apps/client/pages/_app.tsx", "utf-8");
        const modifiedAppContents1 = appContents.replace(
          'import { UiProvider } from "@vastly/ui";',
          "import { UiProvider } from \"@vastly/ui\";\nimport { ApolloWrapper } from '../apollo.jsx';",
        );
        const modifiedAppContents2 = modifiedAppContents1.replace(
          /<Component\s*{\.\.\.pageProps}\s*\/>/,
          "<ApolloWrapper>\n        <Component {...pageProps} />\n       </ApolloWrapper>",
        );
        await writeFile("./apps/client/pages/_app.tsx", modifiedAppContents2);

        //add dependencies and scripts to package.json
        await writeToPackageJson("./apps/client/package.json");

        // configure codgen config file with first generated microservice gql schema
        const codegenConfigContents = await readFile("./apps/client/codegen.ts", "utf-8");
        const modifiedCodegenConfigContents = codegenConfigContents.replace(
          "const serviceName = []",
          `const serviceName = ["${serviceName}"]`,
        );
        await writeFile("./apps/client/codegen.ts", modifiedCodegenConfigContents);

        return { success: true, message: `Successfully generated ${serviceName} service.` };
      }
    } else {
      throw new Error("services and apps folders do not exist");
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: `Something went wrong: ${error}` };
  }
};

const writeToPackageJson = async (filePath: string) => {
  try {
    const packageJson = await readJson(filePath);

    packageJson.scripts = {
      ...packageJson.scripts,
      ...frontendPackageJson.scripts,
    };
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
  scripts: {
    codegen: "graphql-codegen --config codegen.ts",
  },
  dependencies: {
    "@apollo/client": "^3.7.14",
    "@graphql-codegen/typescript-operations": "^4.0.0",
    "@graphql-codegen/typescript-react-apollo": "^3.3.7",
    "@graphql-codegen/typescript-resolvers": "^3.2.1",
    "aws-appsync-auth-link": "^3.0.7",
    "aws-appsync-subscription-link": "^3.1.2",
    graphql: "^16.6.0",
    "@graphql-codegen/cli": "^3.3.1",
  },
};
