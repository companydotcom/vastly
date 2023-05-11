import * as path from "path";
import { spawnSync } from "child_process";
import { copyTemplate } from "./copy-template.js";
import { GenerateAnswers } from "../types";

export const generateLocalRepo = async ({
  repoName,
  packageManager,
  repoDescription,
}: GenerateAnswers) => {
  const localRepoName = repoName.toLowerCase().replace(/\s+/g, "-");
  spawnSync("mkdir", [path.join(process.cwd(), localRepoName)]);
  process.chdir(localRepoName);
  copyTemplate(packageManager, { repoName, repoDescription });
};
