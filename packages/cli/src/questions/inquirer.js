export const loginQuestions = [
  {
    type: "text",
    name: "username",
    message: "What is your Company.com username?",
  },
  {
    type: "password",
    name: "password",
    message: "What is your Company.com password?",
  },
]

export const generateQuestions = [
  {
    type: "list",
    name: "framework",
    message: "Pick a framework",
    choices: [
      { title: "React", value: "React" },
      { title: "Svelte", value: "Svelte" },
      { title: "Vue", value: "Vue" },
    ],
  },
  {
    type: "number",
    name: "microservices",
    message: "How many microservices do you need?",
  },
  {
    type: "text",
    name: "username",
    message: "What is your Github username?",
  },
  {
    type: "password",
    name: "password",
    message: "What is your Github password?",
  },
  {
    type: "list",
    name: "generate",
    message: "Generate?",
    choices: [
      { title: "Yes", value: "yes" },
      { title: "No", value: "no" },
    ],
  },
]
