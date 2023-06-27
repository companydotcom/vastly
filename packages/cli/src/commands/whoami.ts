import chalk from "chalk";

import { Client } from "../util/client.js";
import { MockClient } from "../../__tests__/mocks/client.js";

interface UserResponse {
  email?: string;
}

export default async function whoami(client: Client | MockClient) {
  const { output } = client;

  try {
    const TEMPURL = "https://h0kouesmrl.execute-api.us-east-1.amazonaws.com";

    const { email }: UserResponse = await client.fetch(`${TEMPURL}/dev/user`, {
      method: "GET",
    });

    output.log(email, chalk.green);
    output.log("\n");
  } catch (e) {
    console.log(e);
  }
}
