import chalk from "chalk";
import { Account } from "@vastly/types";
import { Client } from "../../util/client.js";
import { deployFrontend } from "./frontend/index.js";
import { deployBackend } from "./backend/index.js";
import { deployFullStack } from "./fullstack/index.js";

export default async function determineDeployCommand(client: Client, action: string) {
  const { output, config } = client;

  const answers = await client
    .prompt([
      {
        type: "list",
        name: "stage",
        message: "Which account (stage) would you like to deploy to?",
        choices: config.accounts.map((a: Account) => a.account_alias),
      },
    ])
    .then((a) => a)
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        throw new Error("Interactive mode not supported");
      } else {
        // Something else went wrong
        output.error("something wrong");
      }
    });

  try {
    switch (action) {
      case "frontend":
        await deployFrontend(client, answers.stage);
        break;
      case "backend":
        await deployBackend(client, answers.stage);
        break;
      case "all":
        await deployFullStack(client, answers.stage);
        break;
      default:
        console.log(
          `${chalk.red("Missing action! Your choices are `frontend`, `backend`, `fullstack`")}`,
        );
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}
