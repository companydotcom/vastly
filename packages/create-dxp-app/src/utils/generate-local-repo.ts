import { spawnSync } from "child_process"
import { copyTemplate } from "./copy-template.js"
import { GenerateAnswers } from "../types"

export const generateLocalRepo = async (answers: GenerateAnswers) => {
  spawnSync("mkdir", [answers.repoName])
  process.chdir(answers.repoName)
  copyTemplate(answers.packageManager)
}
