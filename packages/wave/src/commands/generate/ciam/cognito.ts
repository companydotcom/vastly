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
        existsSync("./apps/client/app/api/auth") &&
        existsSync("./apps/client/app/api/auth/[...nextauth].js")
      ) {
        spinner.fail("An authentication provider has already been wired up to this app.");
        return {
          success: false,
          message: "An authentication provider has already been wired up to this app.",
        };
      }
      spinner.stopAndPersist();

      spinner = ora({
        text: `Creating new directory and pages:  ${chalk.underline.cyan("apps/client/app")}`,
        color: "yellow",
      }).start();

      await ensureDir("./apps/client/app");
      await copy(template, "./apps/client/app");
      spinner.succeed();
      console.log(chalk.magenta("/app"));
      console.log(chalk.magenta(" |- /api"));
      console.log(chalk.magenta("    |- /auth"));
      console.log(chalk.blueBright("       - authConfig.ts"));
      console.log(chalk.magenta("      |- [...nextauth]"));
      console.log(chalk.blueBright("         - route.ts"));
      console.log(chalk.magenta(" |- /login"));
      console.log(chalk.blueBright("    - page.tsx"));
      console.log(chalk.magenta(" |- /restricted"));
      console.log(chalk.blueBright("    - page.tsx\n"));

      spinner = ora({
        text: `Modifying ${chalk.cyan("layout.tsx")}...\n`,
        color: "yellow",
      }).start();

      // modify layout.tsx file
      const appContents = await readFile("./apps/client/app/layout.tsx", "utf-8");

      // add import statement for session provider
      let innerSpinner = output.spinner;
      innerSpinner = ora({
        text: `Adding import statement`,
        color: "yellow",
      }).start();

      const modifiedAppContents1 = appContents.replace(
        'import { Inter } from "next/font/google";',
        'import { Inter } from "next/font/google";\nimport { SessionProvider } from "next-auth/react";',
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
        text: `Adding SessionProvider Wrapper to ${chalk.cyan("layout.tsx")}\n`,
        color: "yellow",
      }).start();

      const modifiedAppContents3 = modifiedAppContents2.replace(
        "<body className={inter.className}>{children}</body>",
        "<SessionProvider session={session}>\n        <body className={inter.className}>{children}</body>\n       </SessionProvider>",
      );
      await writeFile("./apps/client/app/layout.tsx", modifiedAppContents3);
      innerSpinner.succeed();
      spinner.succeed(`Session Provider successfully added to ${chalk.cyan("layout.tsx")}!\n`);

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
