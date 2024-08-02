import chalk from "chalk";
import { Client } from "../../util/client.js";
import addEnv from "./add.js";
import deleteEnv from "./delete.js";
import pullEnv from "./pull.js";
import pullAllEnv from "./pull-all.js";
import { type Stage } from "../../types/index.js";

export default async function determineEnvCommand(
  client: Client,
  action: string,
  options: { stage: Stage; all?: boolean },
) {
  try {
    switch (action) {
      case "add":
        await addEnv(client, options.stage);
        break;
      case "delete":
        await deleteEnv(client, options.stage);
        break;
      case "pull":
        if (options.all) {
          await pullAllEnv(client, options.stage);
        } else {
          await pullEnv(client, options.stage);
        }
        break;
      default:
        console.log(`${chalk.red("Missing action! Your choices are `add, delete, or pull`")}`);
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}