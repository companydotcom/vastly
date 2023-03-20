export const generateQuestions = [
  {
    type: "text",
    name: "repoName",
    message: "What would you like to name your project?",
  },
  {
    type: "text",
    name: "repoDescription",
    message: "Please enter a description for your project: ",
  },
  {
    type: "text",
    name: "email",
    message: "What is your Github email?",
  },
  {
    type: "text",
    name: "username",
    message: "What is your Github username?",
  },
  {
    type: "password",
    name: "token",
    message: "What is your Github token?",
  },
  {
    type: "list",
    name: "packageManager",
    message: "Which package manager do you want to use?",
    choices: [
      { title: "npm", value: "npm" },
      { title: "yarn", value: "yarn" },
      { title: "pnpm", value: "pnpm" },
    ],
  },
  {
    type: "list",
    name: "generate",
    message: "Generate?",
    choices: [
      { title: "Yes", value: true },
      { title: "No", value: false },
    ],
  },
]
