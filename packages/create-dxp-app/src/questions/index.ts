import { shouldUseYarn } from "../utils/should-use-yarn.js";
import { shouldUsePnpm } from "../utils/should-use-pnpm.js";
import { GenerateAnswers } from "../types/index.js";

//check if yarn and pnpm are installed; if not, disable option in prompt
const isYarnInstalled = shouldUseYarn();
const isPnpmInstalled = shouldUsePnpm();

export const generateQuestions = [
  {
    name: "repoName",
    type: "text",
    message: "What would you like to name your project?",
    validate: (answer: string) => {
      if (answer.length === 0) {
        return "Please enter a name for your project";
      }
      return true;
    },
  },
  {
    name: "repoDescription",
    type: "text",
    message: "Please enter a description for your project: ",
  },
  {
    name: "linkToGithub",
    type: "list",
    message: "Would you like to link your project to GitHub?",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
  },
  {
    name: "email",
    type: "text",
    message: "What is your GitHub email?",
    validate: (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
      }
      return true;
    },
    when: (answers: GenerateAnswers) => answers.linkToGithub,
  },
  {
    name: "username",
    type: "text",
    message: "What is your GitHub username?",
    validate: (answer: string) => {
      if (answer.length === 0) {
        return "Please enter your GitHub username";
      }
      return true;
    },
    when: (answers: GenerateAnswers) => answers.linkToGithub,
  },
  {
    name: "token",
    type: "password",
    message: "What is your GitHub token?",
    validate: (answer: string) => {
      if (answer.length === 0) {
        return "Please enter your GitHub token";
      }
      return true;
    },
    when: (answers: GenerateAnswers) => answers.linkToGithub,
  },
  {
    name: "packageManager",
    type: "list",
    message: "Which package manager do you want to use?",
    choices: [
      { name: "npm", value: "npm" },
      {
        name: "pnpm",
        value: "pnpm",
        disabled: !isPnpmInstalled && "not installed",
      },
      {
        name: "yarn",
        value: "yarn",
        disabled: !isYarnInstalled && "not installed",
      },
    ],
  },
  {
    type: "list",
    name: "generate",
    message: "Generate?",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
  },
];
