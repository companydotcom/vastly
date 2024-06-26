import { Client } from "../../../util/client.js";
import { generatePrismaService } from "./prisma.js";
import { generateEdaService } from "./eda.js";
import { generateSlsService } from "./sls.js";
import { generateStreamingService } from "./streaming.js";
import { ServiceAnswers } from "../../../types";

export const generateService = async (client: Client) => {
  const { output } = client;

  client.prompt(serviceQuestions).then(async (answers: ServiceAnswers) => {
    if (answers.service === "prisma") {
      await generatePrismaService(client, answers.name, answers.description, answers.deploy);
    } else if (answers.service === "eda") {
      await generateEdaService(client);
    } else if (answers.service === "streaming") {
      await generateStreamingService(client);
    } else if (answers.service === "sls") {
      await generateSlsService(client, answers.name, answers.description);
    }
  });
};

const serviceQuestions = [
  {
    name: "service",
    type: "list",
    message: "What type of microservice do you want to generate?",
    choices: [
      { name: "Prisma", value: "prisma" },
      { name: "SLS", value: "sls" },
      {
        name: "EDA (WIP)",
        value: "eda",
        disabled: true,
      },
      {
        name: "Streaming Service (WIP)",
        value: "streaming",
        disabled: true,
      },
    ],
  },
  {
    name: "deploy",
    type: "list",
    message: "How would you like to deploy your microservice?",
    choices: [
      { name: "Prisma-Appsync", value: "prisma-appsync" },
      { name: "Amplify", value: "amplify" },
    ],
    when: (answers: ServiceAnswers) => answers.service === "rest",
  },
  {
    name: "name",
    type: "text",
    message: "What would you like to name your service?",
  },
  {
    name: "description",
    type: "text",
    message: "Please enter a description for your service: ",
  },
];
