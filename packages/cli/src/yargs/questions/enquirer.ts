export const enquirerQuestions = [
  {
    //these 3 are required options for each prompt
    type: "input",
    name: "username",
    message: "What is your GitHub username?",
  },
  {
    type: "input",
    name: "age",
    message: "How old are you?",
    skip: true,
  },
  {
    type: "input",
    name: "about",
    message: "Tell something about yourself",
    //placeholder text and default value to return if the user does not supply a value
    initial: "Why should I?",
  },
  {
    type: "input",
    name: "pizza",
    message: "Do you like pizza?",
  },
]
