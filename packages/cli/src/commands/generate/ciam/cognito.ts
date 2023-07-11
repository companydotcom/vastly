import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pkg from "fs-extra";
import { Client } from "../../../util/client.js";

const { copy, existsSync, ensureDir, readJson, writeJson, readFile, writeFile, move } = pkg;

export const generateCognito = async (client: Client) => {
  const { output } = client;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    const template = path.resolve(__dirname, "../../../../dist/templates/frontend", "ciam");
    if (existsSync("./apps") && existsSync("./apps/client/package.json")) {
      if (
        existsSync("./apps/client/pages/api/auth") &&
        existsSync("./apps/client/pages/api/auth/[...nextauth].js")
      ) {
        throw new Error("An authenticate provider has already been wired up to this app.");
      }
      await ensureDir("./apps/client/pages");
      await copy(template, "./apps/client/pages");

      // modify _app.tsx file
      const appContents = await readFile("./apps/client/pages/_app.tsx", "utf-8");
      // add import statement for session provider
      const modifiedAppContents1 = appContents.replace(
        'import type { AppProps } from "next/app";',
        'import type { AppProps } from "next/app";\nimport { SessionProvider } from "next-auth/react";',
      );
      // destructure pageProps argument to extract session
      const modifiedAppContents2 = modifiedAppContents1.replace(
        /export\s+default\s+function\s+App\(\{\s*Component,\s*pageProps\s*\}: AppProps\)\s*\{/,
        `export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {`,
      );
      // add session provider wrapper around component
      const modifiedAppContents3 = modifiedAppContents2.replace(
        /<Component\s*{\.\.\.pageProps}\s*\/>/,
        "<SessionProvider session={session}>\n        <Component {...pageProps} />\n       </SessionProvider>",
      );
      await writeFile("./apps/client/pages/_app.tsx", modifiedAppContents3);

      // add dependencies and scripts to package.json
      await writeToPackageJson("./apps/client/package.json");

      return { success: true, message: `Successfully generated AWS Cognito CIAM.` };
    } else {
      throw new Error("This command must be run from the root of a create-wave-app monorepo.");
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
      ...ciamPackageJson.dependencies,
    };

    await writeJson(filePath, packageJson, { spaces: 2 });
  } catch (error) {
    console.error("Error writing to package.json:", error);
  }
};

const ciamPackageJson = {
  dependencies: {
    "next-auth": "^4.22.1",
  },
};
