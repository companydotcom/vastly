import { Client } from "../client.js";

interface LoginResult {
  message: string;
}

export default async function executeLogin(client: Client, email: string): Promise<LoginResult> {
  try {
    return await client.fetch<LoginResult>(
      `https://gxmblcgqcb.execute-api.us-east-1.amazonaws.com/dev/login`,
      {
        method: "POST",
        body: {
          email,
        },
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}
