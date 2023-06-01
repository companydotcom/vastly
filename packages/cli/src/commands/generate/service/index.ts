import inquirer from "inquirer";
import { Client } from "../../../util/client.js";
import { generateRestService } from "./rest.js";
import { generateEdaService } from "./eda.js";
import { generateStreamingService } from "./streaming.js";

export const generateService = async (client: Client) => {
  const { output } = client;

  inquirer.prompt(serviceQuestion).then(async (answers) => {
    if (answers.service === "rest") {
      await generateRestService(client);
    } else if (answers.service === "eda") {
      await generateEdaService(client);
    } else if (answers.service === "streaming") {
      await generateStreamingService(client);
    }
  });
};

const serviceQuestion = [
  {
    name: "service",
    type: "list",
    message: "What type of microservice do you want to generate?",
    choices: [
      { name: "REST", value: "rest" },
      {
        name: "EDA",
        value: "eda",
      },
      {
        name: "Streaming Service",
        value: "streaming",
      },
    ],
  },
];
