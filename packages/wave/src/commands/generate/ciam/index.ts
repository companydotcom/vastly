import { Client } from "../../../util/client.js";
import { generateCognito } from "./cognito.js";

export const generateCiam = async (client: Client) => {
  const { output } = client;

  client.prompt(ciamQuestions).then(async (answers) => {
    if (answers.ciam === "cognito") {
      await generateCognito(client);
    }
  });
};

const ciamQuestions = [
  {
    name: "ciam",
    type: "list",
    message: "Which CIAM provider would you like to use?",
    choices: [{ name: "AWS Cognito", value: "cognito" }],
  },
];
