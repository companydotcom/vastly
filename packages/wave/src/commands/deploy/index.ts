import chalk from "chalk";
import { Client } from "../../util/client.js";
import { deployAmplify } from "./amplify/index.js";
import deployFrontend from "./frontend/index.js";

export default async function determineDeployCommand(client: Client, action: string) {
  try {
    switch (action) {
      case "amplify":
        await deployAmplify(client);
        break;
      default:
        console.log(`${chalk.red("Missing action! Your choices are `amplify`")}`);
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}
