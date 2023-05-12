import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { generateQuestions } from "./questions/index.js";
import { generateGithubRepo } from "./utils/generate-github-repo.js";
import { generateLocalRepo } from "./utils/generate-local-repo.js";
import { GenerateAnswers } from "./types/index.js";

const program = new Command();
// TODO: rename
program.description("Vastly create-wave-app").parse(process.argv);

console.log(chalk.yellow.bold(">>> Vastly Wave"));
console.log(chalk.cyan(">>> Welcome to Vastly's Wave! Let's get you set up with a new project."));
console.log();

inquirer.prompt(generateQuestions).then(async (answers: GenerateAnswers) => {
  if (answers.generate && answers.linkToGithub) {
    await generateGithubRepo(answers);
  } else if (answers.generate) {
    await generateLocalRepo(answers);
  }
});
