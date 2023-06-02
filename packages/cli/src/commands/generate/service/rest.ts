import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pkg from "fs-extra";
import { Client } from "../../../util/client.js";

const { copy, existsSync, ensureDir, readJson, writeJson, readFile, writeFile } = pkg;

export const generateRestService = async (client: Client, name: string, description: string) => {
  const { output } = client;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    const backendTemplate = path.resolve(__dirname, "../../../../dist/templates/backend", "rest");
    const frontendTemplate = path.resolve(__dirname, "../../../../dist/templates/frontend", "rest");
    if (
      existsSync("./services") &&
      existsSync("./apps") &&
      existsSync("./apps/client/package.json")
    ) {
      //backend
      await ensureDir(`./services/${name}`);
      await copy(backendTemplate, `./services/${name}`);
      const templateContents = await readFile(`./services/${name}/package.json`, "utf-8");
      const modifiedTemplateContents = templateContents
        .replace("<%= appName %>", name.toLowerCase().replace(/\s+/g, "-"))
        .replace("<%= description %>", description);
      await writeFile(`./services/${name}/package.json`, modifiedTemplateContents);

      //frontend
      await copy(frontendTemplate, "./apps");
      await writeToPackageJson("./apps/client/package.json", frontendPackageJson);
      return { success: true };
    } else {
      throw new Error("services and apps folders do not exist");
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: `Something went wrong: ${error}` };
  }
};

const writeToPackageJson = async (filePath: string, data: any) => {
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
    console.log("Successfully updated package.json.");
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
    "@graphql-codegen/typescript-react-apollo": "^3.3.7",
    "@graphql-codegen/typescript-resolvers": "^3.2.1",
    "aws-appsync-auth-link": "^3.0.7",
    "aws-appsync-subscription-link": "^3.1.2",
    graphql: "^16.6.0",
    "@graphql-codegen/cli": "^3.3.1",
  },
};
