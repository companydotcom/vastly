import ora from "ora";
import chalk from "chalk";
import pkg from "fs-extra";
import * as path from "path";
import { fileURLToPath } from "url";
import { Client } from "../../../util/client.js";

const { copy, existsSync, ensureDir, readJson, writeJson, readFile, writeFile } = pkg;

export const generateCognito = async (client: Client) => {
  const { output } = client;
  let spinner = output.spinner;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    spinner = ora({
      text: chalk.yellow.bold(`\nGenerating cIAM...\n`),
      color: "yellow",
    }).start();

    const template = path.resolve(__dirname, "../../../../dist/templates/frontend", "ciam");
    if (existsSync("./apps") && existsSync("./apps/client/package.json")) {
      if (
        existsSync("./apps/client/pages/api/auth") &&
        existsSync("./apps/client/pages/api/auth/[...nextauth].js")
      ) {
        spinner.fail("An authenticate provider has already been wired up to this app.");
        return {
          success: false,
          message: "An authenticate provider has already been wired up to this app.",
        };
      }
      spinner.stopAndPersist();

      spinner = ora({
        text: `Creating new directory and pages:  ${chalk.underline.cyan("apps/client/pages/api")}`,
        color: "yellow",
      }).start();

      await ensureDir("./apps/client/pages");
      await copy(template, "./apps/client/pages");
      spinner.succeed();
      console.log(chalk.magenta("/pages"));
      console.log(chalk.magenta(" |- /api"));
      console.log(chalk.magenta("   |- /auth"));
      console.log(chalk.blueBright("      - [...nextauth].js"));
      console.log(chalk.blueBright(" |- login.tsx"));
      console.log(chalk.blueBright(" |- restricted.tsx\n"));

      spinner = ora({
        text: `Modifying ${chalk.cyan("_app.tsx")}...\n`,
        color: "yellow",
      }).start();

      // modify _app.tsx file
      const appContents = await readFile("./apps/client/pages/_app.tsx", "utf-8");

      // add import statement for session provider
      let innerSpinner = output.spinner;
      innerSpinner = ora({
        text: `Adding import statement`,
        color: "yellow",
      }).start();

      const modifiedAppContents1 = appContents.replace(
        'import type { AppProps } from "next/app";',
        'import type { AppProps } from "next/app";\nimport { SessionProvider } from "next-auth/react";',
      );
      innerSpinner.succeed();

      // destructure pageProps argument to extract session
      innerSpinner = ora({
        text: `Destructuring arguments to extract session`,
        color: "yellow",
      }).start();

      const modifiedAppContents2 = modifiedAppContents1.replace(
        /export\s+default\s+function\s+App\(\{\s*Component,\s*pageProps\s*\}: AppProps\)\s*\{/,
        `export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {`,
      );
      innerSpinner.succeed();

      // add session provider wrapper around component
      innerSpinner = ora({
        text: `Adding SessionProvider Wrapper to ${chalk.cyan("_app.tsx")}\n`,
        color: "yellow",
      }).start();

      const modifiedAppContents3 = modifiedAppContents2.replace(
        /<Component\s*{\.\.\.pageProps}\s*\/>/,
        "<SessionProvider session={session}>\n        <Component {...pageProps} />\n       </SessionProvider>",
      );
      await writeFile("./apps/client/pages/_app.tsx", modifiedAppContents3);
      innerSpinner.succeed();
      spinner.succeed(`Session Provider successfully added to ${chalk.cyan("_app.tsx")}!\n`);

      spinner = ora({
        text: `Adding dependencies to ${chalk.cyan("package.json")}...\n`,
        color: "yellow",
      }).start();
      // add dependencies and scripts to package.json
      await writeToPackageJson("./apps/client/package.json");

      spinner.succeed("Successfully generated AWS Cognito cIAM. \n");

      console.log();
      console.log(`${chalk.underline.yellow("Next steps:")}`);
      console.log(`Install your new dependency`);
      console.log(`- npm install (or yarn)\n`);

      return { success: true, message: `Successfully generated AWS Cognito cIAM.` };
    } else {
      spinner.fail("This command must be run from the root of a create-wave-app monorepo.");
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
