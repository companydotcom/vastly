import { Client } from "../client.js";

export interface LoginResult {
  status: string;
  message: string;
}

export default async function executeLogin(client: Client, email: string): Promise<LoginResult> {
  try {
    return await client.fetch<LoginResult>(`${client.apiUrl}/dev/onboarding/login`, {
      method: "POST",
      body: {
        email,
      },
    });
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}
