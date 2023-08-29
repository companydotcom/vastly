import { Client } from "../../util/client.js";
import deployFrontend from "./frontend/index.js";

export default async function dev(client: Client) {
  const { output, config } = client;
  try {
    output.log("deploy command...");
    await deployFrontend(client, "dev");
  } catch (err: unknown) {
    output.error(err as string);
  }
}
