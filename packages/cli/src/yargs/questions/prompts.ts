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
    type: "select",
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
    type: "toggle",
    name: "authentication",
    message: "Do you need authentication services via Auth0?",
    initial: false,
    active: "yes",
    inactive: "no",
  },
  {
    type: "number",
    name: "users",
    message: "How many users will your custom offering have",
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
]
