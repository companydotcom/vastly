import { Client } from "../../../util/client.js";
import { generateRestService } from "./rest.js";
import { generateEdaService } from "./eda.js";
import { generateStreamingService } from "./streaming.js";

export const generateService = async (client: Client) => {
  const { output } = client;

  client.prompt(serviceQuestions).then(async (answers) => {
    if (answers.service === "rest") {
      await generateRestService(client, answers.name, answers.description);
    } else if (answers.service === "eda") {
      await generateEdaService(client);
    } else if (answers.service === "streaming") {
      await generateStreamingService(client);
    }
  });
};

const serviceQuestions = [
  {
    name: "service",
    type: "list",
    message: "What type of microservice do you want to generate?",
    choices: [
      { name: "REST", value: "rest" },
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
