import chalk from "chalk";
import { Client } from "../../util/client.js";
import addEnv from "./add.js";
import deleteEnv from "./delete.js";
import pullAllEnv from "./pull-all.js";

export default async function determineEnvCommand(client: Client, action: string) {
  try {
    switch (action) {
      case "add":
        await addEnv(client);
        break;
      case "delete":
        await deleteEnv(client);
        break;
      case "pull":
        await pullAllEnv(client);
        break;
      default:
        console.log(`${chalk.red("Missing action! Your choices are `add, delete, or pull`")}`);
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}
