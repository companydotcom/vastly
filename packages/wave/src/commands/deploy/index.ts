import { Client } from "../../util/client.js";

export default async function dev(client: Client) {
  const { output } = client;

  try {
    output.log("deploy command...");
    return 0;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
