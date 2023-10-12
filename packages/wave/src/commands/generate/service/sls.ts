import ora from "ora";
import chalk from "chalk";
import pkg from "fs-extra";
import { execSync } from "child_process";
import lodashPkg from "lodash";
import * as path from "path";
import { fileURLToPath } from "url";

import { Client } from "../../../util/client.js";

const { existsSync, readFile, writeFile, readJson, writeJson, ensureDir, copy, move } = pkg;
const { kebabCase, camelCase } = lodashPkg;

export const generateSlsService = async (client: Client, name: string, description: string) => {
  const { output } = client;

  console.log("generating streaming service");
};
