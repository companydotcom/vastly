import chalk from "chalk";
import { Client } from "../../util/client.js";
import addEnv from "./add.js";
import deleteEnv from "./delete.js";
import pullEnv from "./pull.js";
import pullAllEnv from "./pull-all.js";

export default async function determineEnvCommand(client: Client, action: string, options: any) {
  try {
    switch (action) {
      case "add":
        await addEnv(client);
        break;
      case "delete":
        await deleteEnv(client);
        break;
      case "pull":
        if (options.all) {
          await pullAllEnv(client);
        } else {
          await pullEnv(client);
        }
        break;
      default:
        console.log(`${chalk.red("Missing action! Your choices are `add, delete, or pull`")}`);
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}