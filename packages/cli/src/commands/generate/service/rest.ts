import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pkg from "fs-extra";
const { copy, existsSync } = pkg;
import { Client } from "../../../util/client.js";

export const generateRestService = async (client: Client) => {
  const { output } = client;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    let backendTemplate = path.resolve(__dirname, "../../../../dist/templates/backend", "rest");
    let frontendTemplate = path.resolve(__dirname, "../../../../dist/templates/frontend", "rest");
    if (existsSync("./services") && existsSync("./apps")) {
      // await copy(backendTemplate, "./services");
      // await copy(frontendTemplate, "./apps")
      return { success: true };
    } else {
      throw new Error("services and apps folders do not exist");
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: `Something went wrong: ${error}` };
  }
};
