import path from "node:path";
import { findUp } from "find-up";
import pkg from "fs-extra";
import chalk from "chalk";
import { EnvVariable } from "../../types";

// Cache directory config and find root
const { writeFile } = pkg;
const config = ["apps", "services", "pnpm-workspace.yaml"];

export default async function writeToFile(
  data: EnvVariable[],
  directory: string[] | ["root"],
  fileName: string,
) {
  const rootDir = path.dirname((await findUp(config, { type: "directory" })) || ".");
  const content = convertJSONToEnv(data);

  try {
    // Writes .env files to directories
    directory.forEach(async (dir) => {
      let root: string;
      if (dir === "root" || !directory.length) {
        root = path.dirname((await findUp(config, { type: "directory" })) || ".");
        writeFile(`${root}/${fileName}`, content, (err) => {
          if (err) throw err;
        });
      } else {
        writeFile(`${rootDir}/${dir}/${fileName}`, content, (err) => {
          if (err) throw err;
        });
      }
    });
    return directory;
  } catch (err: any) {
    console.error(`Failed to write env files: ${err.message}`);
    throw err;
  }
}

const convertJSONToEnv = (items: Record<string, any>[]): string => {
  return items.reduce((envFile, item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    return envFile + `${key}=${value}\n`;
  }, "");
};
