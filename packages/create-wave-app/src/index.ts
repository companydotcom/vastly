#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { Command } from "commander";
import { exit } from "node:process";
import { generateQuestions } from "./questions/index.js";
import { generateGithubRepo } from "./utils/generate-github-repo.js";
import { generateLocalRepo } from "./utils/generate-local-repo.js";
import { GenerateAnswers } from "./types/index.js";

const program = new Command();
program.description("Vastly create-wave-app").parse(process.argv);

console.log(chalk.yellow.bold(">>> Vastly Wave <<<"));
console.log(chalk.cyan(">>> Welcome to Vastly's Wave! Let's get you set up with a new project."));
console.log();

inquirer.prompt(generateQuestions).then(async (answers: GenerateAnswers) => {
  try {
    if (!answers.generate) {
      exit(0);
    }

    if (answers.linkToGithub) {
      await generateGithubRepo(answers);
    } else {
      await generateLocalRepo(answers);
    }
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
    exit(1);
  }
});
