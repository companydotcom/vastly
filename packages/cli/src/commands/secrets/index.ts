import chalk from "chalk";
import { Client } from "../../util/client.js";
import addSecret from "./add-secret.js";
import deleteSecret from "./delete-secret.js";
import getSecret from "./get-secret.js";

export default async function determineSecretCommand(client: Client, action: string) {
  try {
    switch (action) {
      case "add":
        await addSecret(client);
        break;
      case "delete":
        await deleteSecret(client);
        break;
      case "get":
        await getSecret(client);
        break;
      default:
        console.log(`${chalk.red("Missing action! Your choices are `add, delete, or get`")}`);
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}
