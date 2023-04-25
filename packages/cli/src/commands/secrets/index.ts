import chalk from "chalk";
import { Client } from "../../util/client.js";
import addSecret from "./add-secret.js";
import deleteSecret from "./delete-secret.js";
import getAllSecrets from "./get-all-secrets.js";

export default async function determineSecretCommand(client: Client, action: string) {
  try {
    switch (action) {
      case "add":
        await addSecret(client);
        break;
      case "delete":
        await deleteSecret(client);
        break;
      case "pull":
        await getAllSecrets(client);
        break;
      default:
        console.log(`${chalk.red("Missing action! Your choices are `add, delete, or pull`")}`);
    }
  } catch (err) {
    console.error("Something went wrong :( ---> ", err);
  }
}
