import { Client } from "../client.js";

export interface VerifyResult {
  token: string;
}

export default async function executeVerify(
  client: Client,
  email: string | string[],
  token: string,
): Promise<VerifyResult> {
  try {
    return await client.fetch<VerifyResult>(`${client.apiUrl}/onboarding/verify`, {
      method: "POST",
      body: {
        email,
        token,
      },
    });
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}
