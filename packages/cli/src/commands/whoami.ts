import chalk from "chalk";
import { Client } from "../util/client.js";
import { MockClient } from "../../__tests__/mocks/client.js";

interface UserResponse {
  email?: string;
}

interface WhoamiOptions {
  token?: boolean;
}

export default async function whoami(client: Client | MockClient, options: WhoamiOptions) {
  const { output } = client;

  try {
    const { email }: UserResponse = await client.fetch(`${client.apiUrl}/user`, {
      method: "GET",
    });

    if (!email) {
      throw new Error();
    }

    if (options.token) {
      if (!client.config?.token) {
        throw new Error();
      }

      output.log(`${client.config.token}\n`, chalk.cyan);
    }

    output.log(email, chalk.cyan);
    output.log("\n");
  } catch (e) {
    output.error("There was a problem fetching your user. Did you try running vastly login first?");
  }
}
