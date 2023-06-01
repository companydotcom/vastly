import chalk from "chalk";
import { Client } from "../../util/client.js";
import { generateService } from "./service/index.js";

export default async function determineGenerateCommand(client: Client, action: string) {
  try {
    switch (action) {
      case "service":
        await generateService(client);
        break;
      default:
        console.log(`${chalk.red("Missing action! Your choices are `service`")}`);
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}
