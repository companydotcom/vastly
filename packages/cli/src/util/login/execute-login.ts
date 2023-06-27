import { errorToString } from "@vastly/utils";
import { Client } from "../client.js";
import { isAPIError } from "../error.js";

export interface LoginResult {
  status: string;
  message: string;
}

export default async function executeLogin(
  client: Client,
  email: string,
): Promise<number | LoginResult> {
  const { apiUrl } = client;

  try {
    return await client.fetch<LoginResult>(`${apiUrl}/dev/onboarding/login`, {
      method: "POST",
      body: {
        email,
      },
    });
  } catch (err: unknown) {
    if (isAPIError(err)) {
      if (err.code === "USER_NOT_FOUND") {
        throw new Error("User not found. Please sign up.");
      }
    }

    throw new Error(`Unexpected error: ${errorToString(err)}`);
  }
}
