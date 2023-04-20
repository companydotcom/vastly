import path from "node:path";
import { findUp, findUpSync } from "find-up";
import fastGlob from "fast-glob";
import pMap from "p-map";
import pkg from "fs-extra";
import yaml from "js-yaml";
import { Secret } from "../types";

// Cache directory config and find root
const { writeFile, pathExists } = pkg;
const config = ["apps", "services", "pnpm-workspace.yaml"];
const rootDir = path.dirname((await findUp(config, { type: "directory" })) || ".");

export default async function helloworld(data: Secret[]) {
  const content = convertJSONToEnv(data);
  const contentYAML = yaml.dump(data);

  const globOptions = {
    cwd: rootDir,
    onlyDirectories: true,
    deep: 1,
  };

  try {
    // Finds child directories and combines them
    const allEnvDirs = await fastGlob("apps/*/", globOptions);
    const allYmlDirs = await fastGlob("services/*/", globOptions);

    // Writes .env files to directories
    const rootPromise = await writeFile(`${rootDir}/.env`, content);
    const envPromises = allEnvDirs.map(async (dir) => {
      const envFilePath = path.join(rootDir, dir, ".env");
      await writeFile(envFilePath, content);
    });
    const ymlPromises = allYmlDirs.map(async (dir) => {
      const envYmlFilePath = path.join(rootDir, dir, "env.yml");
      await writeFile(envYmlFilePath, `${contentYAML}\n`);
    });

    const result = await Promise.all([rootPromise, ...envPromises, ...ymlPromises]);
    return result;
  } catch (err: any) {
    console.error(`Failed to write env files: ${err.message}`);
    throw err;
  }
}

const convertJSONToEnv = (items: Record<string, any>[]) => {
  return items.reduce((envFile, item) => {
    return envFile + `${item.secretKey}=${item.secretValue}\n`;
  }, "");
};

const convertToYaml = (items: Secret[]) => {
  return items.map(({ secretKey, secretValue }) => yaml.dump({ secretKey, secretValue }));
};
