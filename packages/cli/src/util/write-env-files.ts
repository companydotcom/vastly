import path from "node:path";
import { findUp } from "find-up";
import pkg from "fs-extra";
import chalk from "chalk";
import { EnvVariable } from "../types";

// Cache directory config and find root
const { writeFile } = pkg;
const config = ["apps", "services", "pnpm-workspace.yaml"];
const rootDir = path.dirname((await findUp(config, { type: "directory" })) || ".");

export default async function writeToFile(data: EnvVariable[], directory: string[] | ["root"]) {
  const content = convertJSONToEnv(data);
  // const contentYAML = yaml.dump(data);

  try {
    // Writes .env files to directories
    directory.forEach(async (dir) => {
      let root;
      if (dir === "root" || !directory.length) {
        root = path.dirname((await findUp(config, { type: "directory" })) || ".");
        writeFile(`${root}/.env`, content, (err) => {
          if (err) throw err;
          console.log(chalk.green(`File saved to `) + chalk.underline.cyan(`${dir}`));
        });
      } else {
        writeFile(`${rootDir}/${dir}/.env`, content, (err) => {
          if (err) throw err;
          console.log(chalk.green(`File saved to `) + chalk.underline.cyan(`${dir}`));
        });
      }
    });
  } catch (err: any) {
    console.error(`Failed to write env files: ${err.message}`);
    throw err;
  }
}

const convertJSONToEnv = (items: Record<string, any>[]): string => {
  return items.reduce((envFile, item) => {
    return envFile + `${item.key}=${item.value}\n`;
  }, "");
};

// const convertToYaml = (items: Secret[]): string[] => {
//   return items.map(({ secretKey, secretValue }) => yaml.dump({ secretKey, secretValue }));
// };
