import * as path from "path";
import { spawnSync } from "child_process";
import { copyTemplate } from "./copy-template.js";
import { GenerateAnswers, GeneratorResponse } from "../types/index.js";

export const generateLocalRepo = async ({
  repoName,
  packageManager,
  repoDescription,
}: GenerateAnswers): Promise<GeneratorResponse> => {
  const localRepoName = repoName.toLowerCase().replace(/\s+/g, "-");

  spawnSync("mkdir", [path.join(process.cwd(), localRepoName)]);
  process.chdir(localRepoName);
  return await copyTemplate(packageManager, { repoName, repoDescription });
};
