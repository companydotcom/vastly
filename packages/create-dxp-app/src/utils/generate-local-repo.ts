import * as path from "path";
import { spawnSync } from "child_process";
import { copyTemplate } from "./copy-template.js";
import { GenerateAnswers } from "../types";

export const generateLocalRepo = async ({ repoName, packageManager }: GenerateAnswers) => {
  spawnSync("mkdir", [path.join(process.cwd(), repoName)]);
  process.chdir(repoName);
  copyTemplate(packageManager);
};
